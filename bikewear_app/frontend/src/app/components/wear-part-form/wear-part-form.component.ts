import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WearPart } from '../../models/wear-part';
import { WearPartCategory } from '../../models/wear-part-category';
import { WearPartService } from '../../services/wear-part.service';
import { BikeService } from '../../services/bike.service';
import { TeilVorlageService } from '../../services/teil-vorlage.service';
import { TeilVorlage } from '../../models/teil-vorlage';

@Component({
  selector: 'app-wear-part-form',
  templateUrl: './wear-part-form.component.html',
  styleUrls: ['./wear-part-form.component.css']
})
export class WearPartFormComponent implements OnInit {
  @Input() radId!: number;
  @Input() currentKilometerstand: number = 0;
  @Input() existingPart?: WearPart;
  @Input() editMode: boolean = false;
  @Output() saved = new EventEmitter<void>();

  categories = Object.values(WearPartCategory);
  error = '';
  saving = false;
  loadingOdometer = false;

  // Autocomplete state
  private allTeile: TeilVorlage[] = [];
  private teileLoaded = false;
  suggestions: TeilVorlage[] = [];
  showSuggestions = false;
  activeSuggestionIndex = -1;

  part: Partial<WearPart> = {};

  ngOnInit(): void {
    if (this.editMode && this.existingPart) {
      this.part = { ...this.existingPart };
    } else {
      this.part = {
        radId: this.radId,
        name: '',
        kategorie: WearPartCategory.Sonstiges,
        einbauKilometerstand: this.currentKilometerstand,
        ausbauKilometerstand: 0,
        einbauDatum: new Date(),
        ausbauDatum: undefined as any
      };
    }
  }

  get einbauDatumStr(): string {
    if (!this.part.einbauDatum) return '';
    const d = new Date(this.part.einbauDatum);
    return d.toISOString().substring(0, 10);
  }

  set einbauDatumStr(val: string) {
    this.part.einbauDatum = val ? new Date(val) : undefined as any;
    if (val && this.radId) {
      this.loadingOdometer = true;
      this.bikeService.getOdometerAt(this.radId, val).subscribe({
        next: (km) => {
          this.part.einbauKilometerstand = km;
          this.loadingOdometer = false;
        },
        error: () => {
          this.loadingOdometer = false;
        }
      });
    }
  }

  get ausbauDatumStr(): string {
    if (!this.part.ausbauDatum) return '';
    const d = new Date(this.part.ausbauDatum);
    return d.toISOString().substring(0, 10);
  }

  set ausbauDatumStr(val: string) {
    this.part.ausbauDatum = val ? new Date(val) : undefined as any;
  }

  // ── Autocomplete ──────────────────────────────────────────────────────────

  onNameInput(): void {
    const query = (this.part.name ?? '').trim().toLowerCase();
    if (!query) {
      this.suggestions = [];
      this.showSuggestions = false;
      return;
    }

    const proceed = () => {
      this.suggestions = this.allTeile
        .filter(t =>
          t.name.toLowerCase().includes(query) ||
          t.hersteller.toLowerCase().includes(query)
        )
        .slice(0, 8);
      this.showSuggestions = this.suggestions.length > 0;
      this.activeSuggestionIndex = -1;
    };

    if (this.teileLoaded) {
      proceed();
    } else {
      this.teilVorlageService.getAll().subscribe({
        next: (data) => {
          this.allTeile = data;
          this.teileLoaded = true;
          proceed();
        }
      });
    }
  }

  onNameKeydown(event: KeyboardEvent): void {
    if (!this.showSuggestions) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeSuggestionIndex = Math.min(
        this.activeSuggestionIndex + 1, this.suggestions.length - 1
      );
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeSuggestionIndex = Math.max(this.activeSuggestionIndex - 1, -1);
    } else if (event.key === 'Enter' && this.activeSuggestionIndex >= 0) {
      event.preventDefault();
      this.selectSuggestion(this.suggestions[this.activeSuggestionIndex]);
    } else if (event.key === 'Escape') {
      this.closeSuggestions();
    }
  }

  selectSuggestion(teil: TeilVorlage): void {
    this.part.name = `${teil.hersteller} ${teil.name}`.trim();
    this.part.kategorie = teil.kategorie;
    this.closeSuggestions();
  }

  closeSuggestions(): void {
    this.showSuggestions = false;
    this.activeSuggestionIndex = -1;
  }

  onNameBlur(): void {
    // Small delay so a click on a suggestion registers before hiding
    setTimeout(() => this.closeSuggestions(), 150);
  }

  // ──────────────────────────────────────────────────────────────────────────

  save(): void {
    if (!this.part.name?.trim()) {
      this.error = 'Bitte einen Namen angeben.';
      return;
    }
    this.saving = true;
    const request$ = this.editMode && this.part.id
      ? this.wearPartService.updateWearPart(this.part.id, this.part as WearPart)
      : this.wearPartService.addWearPart(this.part as WearPart);
    request$.subscribe({
      next: () => {
        this.saving = false;
        this.saved.emit();
      },
      error: () => {
        this.error = 'Fehler beim Speichern des Verschleißteils.';
        this.saving = false;
      }
    });
  }

  constructor(
    private wearPartService: WearPartService,
    private bikeService: BikeService,
    private teilVorlageService: TeilVorlageService
  ) {}
}
