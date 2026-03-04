import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TeilVorlage } from '../../models/teil-vorlage';
import { WearPartCategory } from '../../models/wear-part-category';
import { WearPart } from '../../models/wear-part';
import { Bike } from '../../models/bike';
import { TeilVorlageService } from '../../services/teil-vorlage.service';
import { BikeService } from '../../services/bike.service';
import { WearPartService } from '../../services/wear-part.service';

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
  suchbegriff = '';

  // Autocomplete
  autocompleteItems: string[] = [];
  showAutocomplete = false;
  herstellerSuggestions: string[] = [];
  showHerstellerSuggestions = false;
  private allNamen: string[] = [];
  private searchInput$ = new Subject<string>();

  readonly fahrradKategorien = ['Rennrad', 'Gravel', 'Mountainbike'];
  readonly kategorien: WearPartCategory[] = [
    WearPartCategory.Kette,
    WearPartCategory.Kassette,
    WearPartCategory.Kettenblatt,
    WearPartCategory.Reifen,
    WearPartCategory.Federung,
    WearPartCategory.Sonstiges
  ];

  // Add to bike dialog
  bikes: Bike[] = [];
  bikesLoading = false;
  showAddToBikeDialog = false;
  selectedTeil: TeilVorlage | null = null;
  addToBikePart: Partial<WearPart> = {};
  addToBikeLoading = false;
  addToBikeError: string | null = null;
  addToBikeSuccess = false;

  private readonly newTeilDefault: Partial<TeilVorlage> = {
    id: 0,
    name: '',
    hersteller: '',
    kategorie: WearPartCategory.Kette,
    gruppe: null,
    geschwindigkeiten: null,
    fahrradKategorien: '',
    beschreibung: null
  };

  // Add form
  showAddForm = false;
  addLoading = false;
  addError: string | null = null;
  enriching = false;
  enrichError: string | null = null;
  addSuccess = false;
  isEnriched = false;

  // Validation dialog state
  showValidationDialog = false;
  validationDialogStep: 'confirm' | 'support' = 'confirm';
  validationGrund = '';
  supportRequestSent = false;

  newTeil: Partial<TeilVorlage> = { ...this.newTeilDefault };

  private readonly SUCCESS_MESSAGE_DURATION_MS = 1200;

  constructor(
    private teilVorlageService: TeilVorlageService,
    private bikeService: BikeService,
    private wearPartService: WearPartService,
    private elRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.loadTeile();
    this.loadAllNamen();
    this.loadBikes();

    this.searchInput$.pipe(
      debounceTime(200),
      distinctUntilChanged()
    ).subscribe(term => {
      this.updateAutocomplete(term);
      this.loadTeile();
    });
  }

  private loadAllNamen(): void {
    this.teilVorlageService.getAll().subscribe({
      next: (data) => {
        this.allNamen = [...new Set(data.map(t => t.name))].sort();
      }
    });
  }

  private updateAutocomplete(term: string): void {
    if (!term.trim()) {
      this.autocompleteItems = [];
      this.showAutocomplete = false;
      return;
    }
    const lower = term.toLowerCase();
    this.autocompleteItems = this.allNamen
      .filter(n => n.toLowerCase().includes(lower))
      .slice(0, 8);
    this.showAutocomplete = this.autocompleteItems.length > 0;
  }

  onSuchbegriffChange(): void {
    this.searchInput$.next(this.suchbegriff);
  }

  selectAutocomplete(name: string): void {
    this.suchbegriff = name;
    this.showAutocomplete = false;
    this.loadTeile();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.showAutocomplete = false;
      this.showHerstellerSuggestions = false;
    }
  }

  loadTeile(): void {
    this.loading = true;
    this.error = null;

    const filters = {
      kategorie:        this.selectedKategorie      as WearPartCategory || undefined,
      hersteller:       this.selectedHersteller      || undefined,
      fahrradKategorie: this.selectedFahrradKategorie || undefined,
      suche:            this.suchbegriff              || undefined
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
    this.showHerstellerSuggestions = false;
    this.loadTeile();
  }

  onHerstellerChange(): void {
    this.loadTeile();
  }

  onHerstellerInput(): void {
    const term = this.selectedHersteller.toLowerCase();
    if (!term) {
      this.herstellerSuggestions = [];
      this.showHerstellerSuggestions = false;
      this.loadTeile();
      return;
    }
    this.herstellerSuggestions = this.hersteller
      .filter(h => h.toLowerCase().includes(term))
      .slice(0, 8);
    this.showHerstellerSuggestions = this.herstellerSuggestions.length > 0;
  }

  selectHersteller(h: string): void {
    this.selectedHersteller = h;
    this.showHerstellerSuggestions = false;
    this.loadTeile();
  }

  clearFilters(): void {
    this.selectedFahrradKategorie = '';
    this.selectedKategorie = '';
    this.selectedHersteller = '';
    this.suchbegriff = '';
    this.showAutocomplete = false;
    this.showHerstellerSuggestions = false;
    this.loadTeile();
  }

  private loadBikes(): void {
    this.bikesLoading = true;
    this.bikeService.getBikes().subscribe({
      next: (data) => {
        this.bikes = data;
        this.bikesLoading = false;
      },
      error: () => { this.bikesLoading = false; }
    });
  }

  openAddToBikeDialog(teil: TeilVorlage): void {
    this.selectedTeil = teil;
    const defaultBike = this.bikes[0] ?? null;
    this.addToBikePart = {
      radId: defaultBike?.id ?? 0,
      name: `${teil.hersteller} ${teil.name}`.trim(),
      kategorie: teil.kategorie,
      position: null,
      einbauKilometerstand: defaultBike?.kilometerstand ?? 0,
      ausbauKilometerstand: null,
      einbauDatum: new Date(),
      ausbauDatum: null,
      einbauFahrstunden: defaultBike?.fahrstunden ?? null,
      ausbauFahrstunden: null,
      notizen: null
    };
    this.addToBikeError = null;
    this.addToBikeSuccess = false;
    this.showAddToBikeDialog = true;
  }

  closeAddToBikeDialog(): void {
    this.showAddToBikeDialog = false;
    this.selectedTeil = null;
    this.addToBikeError = null;
    this.addToBikeSuccess = false;
  }

  onAddToBikeRadChange(): void {
    const bike = this.bikes.find(b => b.id === Number(this.addToBikePart.radId));
    if (bike) {
      this.addToBikePart.einbauKilometerstand = bike.kilometerstand;
      this.addToBikePart.einbauFahrstunden = bike.fahrstunden;
    }
  }

  get addToBikeEinbauDatumStr(): string {
    if (!this.addToBikePart.einbauDatum) return '';
    return new Date(this.addToBikePart.einbauDatum).toISOString().substring(0, 10);
  }

  set addToBikeEinbauDatumStr(val: string) {
    this.addToBikePart.einbauDatum = val ? new Date(val) : (undefined as any);
  }

  get addToBikeShowPositionDropdown(): boolean {
    return this.addToBikePart.kategorie === WearPartCategory.Reifen ||
           this.addToBikePart.kategorie === WearPartCategory.Kettenblatt ||
           this.addToBikePart.kategorie === WearPartCategory.Federung;
  }

  get addToBikePositions(): string[] {
    if (this.addToBikePart.kategorie === WearPartCategory.Reifen) return ['Vorderrad', 'Hinterrad'];
    if (this.addToBikePart.kategorie === WearPartCategory.Kettenblatt) return ['Einteilig', 'Klein', 'Groß', 'Mittel'];
    if (this.addToBikePart.kategorie === WearPartCategory.Federung) return ['Federgabel', 'Dämpfer'];
    return [];
  }

  saveAddToBike(): void {
    if (!this.addToBikePart.radId) {
      this.addToBikeError = 'Bitte ein Rad auswählen.';
      return;
    }
    if (!this.addToBikePart.einbauDatum) {
      this.addToBikeError = 'Bitte ein Einbaudatum angeben.';
      return;
    }
    this.addToBikeLoading = true;
    this.addToBikeError = null;
    this.wearPartService.addWearPart(this.addToBikePart as WearPart).subscribe({
      next: () => {
        this.addToBikeLoading = false;
        this.addToBikeSuccess = true;
        setTimeout(() => this.closeAddToBikeDialog(), 1200);
      },
      error: () => {
        this.addToBikeLoading = false;
        this.addToBikeError = 'Teil konnte nicht hinzugefügt werden.';
      }
    });
  }

  /** Returns the individual bike category badges for a comma-separated string */
  getBadges(fahrradKategorien: string): string[] {
    return fahrradKategorien.split(',').map(k => k.trim()).filter(Boolean);
  }

  get hasActiveFilters(): boolean {
    return !!(this.selectedFahrradKategorie || this.selectedKategorie || this.selectedHersteller || this.suchbegriff);
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) this.resetAddForm();
  }

  resetAddForm(): void {
    this.newTeil = { ...this.newTeilDefault };
    this.addError = null;
    this.enrichError = null;
    this.addSuccess = false;
    this.supportRequestSent = false;
    this.isEnriched = false;
  }

  enrichTeil(): void {
    if (!this.newTeil.name?.trim()) {
      this.enrichError = 'Bitte zuerst einen Namen eingeben.';
      return;
    }
    this.runEnrichment();
  }

  private runEnrichment(afterSuccess?: () => void): void {
    this.enriching = true;
    this.enrichError = null;
    this.supportRequestSent = false;
    this.teilVorlageService.enrich(this.newTeil).subscribe({
      next: (enriched) => {
        this.newTeil = { ...enriched };
        this.enriching = false;
        this.isEnriched = true;
        afterSuccess?.();
      },
      error: (err) => {
        this.enriching = false;
        if (err.status === 422) {
          this.validationGrund = err.error?.grund ?? '';
          this.validationDialogStep = 'confirm';
          this.showValidationDialog = true;
        } else {
          this.enrichError = 'KI-Anreicherung fehlgeschlagen. Bitte Felder manuell ausfüllen.';
        }
      }
    });
  }

  onValidationNein(): void {
    this.showValidationDialog = false;
    this.enrichError = 'Kein gültiges Fahrradteil erkannt.';
  }

  onValidationJa(): void {
    this.validationDialogStep = 'support';
  }

  onSupportAbbrechen(): void {
    this.showValidationDialog = false;
    this.validationGrund = '';
  }

  onSupportAnfrage(): void {
    this.showValidationDialog = false;
    this.validationGrund = '';
    this.supportRequestSent = true;
  }

  saveTeil(): void {
    if (!this.newTeil.name?.trim()) {
      this.addError = 'Name ist ein Pflichtfeld.';
      return;
    }
    if (!this.isEnriched) {
      this.runEnrichment(() => this.doSaveTeil());
      return;
    }
    this.doSaveTeil();
  }

  private doSaveTeil(): void {
    if (!this.newTeil.name?.trim() || !this.newTeil.hersteller?.trim() || !this.newTeil.fahrradKategorien?.trim()) {
      this.addError = 'Name, Hersteller und Fahrradkategorien sind Pflichtfelder.';
      return;
    }
    this.addLoading = true;
    this.addError = null;
    this.teilVorlageService.add(this.newTeil as TeilVorlage).subscribe({
      next: () => {
        this.addSuccess = true;
        this.addLoading = false;
        setTimeout(() => {
          this.showAddForm = false;
          this.resetAddForm();
          this.loadTeile();
        }, this.SUCCESS_MESSAGE_DURATION_MS);
      },
      error: () => {
        this.addError = 'Teil konnte nicht gespeichert werden.';
        this.addLoading = false;
      }
    });
  }
}
