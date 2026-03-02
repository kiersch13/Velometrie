import { Component, OnInit } from '@angular/core';
import { TeilVorlage } from '../../models/teil-vorlage';
import { WearPartCategory } from '../../models/wear-part-category';
import { TeilVorlageService } from '../../services/teil-vorlage.service';

@Component({
  selector: 'app-teil-bibliothek',
  templateUrl: './teil-bibliothek.component.html',
  styleUrls: ['./teil-bibliothek.component.css']
})
export class TeilBibliothekComponent implements OnInit {

  teile: TeilVorlage[] = [];
  hersteller: string[] = [];

  loading = false;
  error: string | null = null;

  // Filters
  selectedFahrradKategorie = '';
  selectedKategorie = '';
  selectedHersteller = '';

  readonly fahrradKategorien = ['Rennrad', 'Gravel', 'Mountainbike'];
  readonly kategorien: WearPartCategory[] = [
    WearPartCategory.Kette,
    WearPartCategory.Kassette,
    WearPartCategory.Kettenblatt,
    WearPartCategory.Reifen,
    WearPartCategory.Sonstiges
  ];

  // ── Add-part form ──────────────────────────────────────────────────────────
  showAddForm   = false;
  enriching     = false;
  saving        = false;
  formError: string | null = null;
  saveSuccess   = false;

  form: Partial<TeilVorlage> = {};

  constructor(private teilVorlageService: TeilVorlageService) {}

  ngOnInit(): void {
    this.loadTeile();
  }

  loadTeile(): void {
    this.loading = true;
    this.error = null;

    const filters = {
      kategorie:        this.selectedKategorie      as WearPartCategory || undefined,
      hersteller:       this.selectedHersteller      || undefined,
      fahrradKategorie: this.selectedFahrradKategorie || undefined
    };

    this.teilVorlageService.getAll(filters).subscribe({
      next: (data) => {
        this.teile = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Teilebibliothek konnte nicht geladen werden.';
        this.loading = false;
      }
    });

    // Refresh manufacturer list based on current category + bike category filter
    this.teilVorlageService.getHersteller({
      kategorie:        this.selectedKategorie      as WearPartCategory || undefined,
      fahrradKategorie: this.selectedFahrradKategorie || undefined
    }).subscribe({ next: (h) => (this.hersteller = h) });
  }

  onFilterChange(): void {
    this.selectedHersteller = '';
    this.loadTeile();
  }

  onHerstellerChange(): void {
    this.loadTeile();
  }

  clearFilters(): void {
    this.selectedFahrradKategorie = '';
    this.selectedKategorie = '';
    this.selectedHersteller = '';
    this.loadTeile();
  }

  /** Returns the individual bike category badges for a comma-separated string */
  getBadges(fahrradKategorien: string): string[] {
    return fahrradKategorien.split(',').map(k => k.trim()).filter(Boolean);
  }

  get hasActiveFilters(): boolean {
    return !!(this.selectedFahrradKategorie || this.selectedKategorie || this.selectedHersteller);
  }

  // ── Add-part form handlers ─────────────────────────────────────────────────

  openAddForm(): void {
    this.form        = { fahrradKategorien: '', kategorie: WearPartCategory.Kette };
    this.formError   = null;
    this.saveSuccess = false;
    this.showAddForm = true;
  }

  closeAddForm(): void {
    this.showAddForm = false;
  }

  enrichForm(): void {
    if (!this.form.name?.trim()) {
      this.formError = 'Bitte zuerst einen Teilenamen eingeben.';
      return;
    }
    this.formError  = null;
    this.enriching  = true;

    this.teilVorlageService.enrich(this.form).subscribe({
      next: (enriched) => {
        this.form      = { ...enriched, id: 0 };
        this.enriching = false;
      },
      error: () => {
        this.formError = 'KI-Anreicherung fehlgeschlagen. Bitte Felder manuell ausfüllen.';
        this.enriching = false;
      }
    });
  }

  saveForm(): void {
    if (!this.form.name?.trim() || !this.form.hersteller?.trim() || !this.form.fahrradKategorien?.trim()) {
      this.formError = 'Name, Hersteller und Fahrradkategorien sind Pflichtfelder.';
      return;
    }
    this.formError = null;
    this.saving    = true;

    const teil: TeilVorlage = {
      id:                 0,
      name:               this.form.name!,
      hersteller:         this.form.hersteller!,
      kategorie:          this.form.kategorie ?? WearPartCategory.Sonstiges,
      gruppe:             this.form.gruppe    ?? null,
      geschwindigkeiten:  this.form.geschwindigkeiten ?? null,
      fahrradKategorien:  this.form.fahrradKategorien!,
      beschreibung:       this.form.beschreibung ?? null
    };

    this.teilVorlageService.add(teil).subscribe({
      next: () => {
        this.saving      = false;
        this.saveSuccess = true;
        this.showAddForm = false;
        this.loadTeile();
      },
      error: () => {
        this.formError = 'Speichern fehlgeschlagen. Bitte erneut versuchen.';
        this.saving    = false;
      }
    });
  }
}
