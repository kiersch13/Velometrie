import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
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
  suchbegriff = '';

  // Autocomplete
  autocompleteItems: string[] = [];
  showAutocomplete = false;
  private allNamen: string[] = [];
  private searchInput$ = new Subject<string>();

  readonly fahrradKategorien = ['Rennrad', 'Gravel', 'Mountainbike'];
  readonly kategorien: WearPartCategory[] = [
    WearPartCategory.Kette,
    WearPartCategory.Kassette,
    WearPartCategory.Kettenblatt,
    WearPartCategory.Reifen,
    WearPartCategory.Sonstiges
  ];

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

  newTeil: Partial<TeilVorlage> = { ...this.newTeilDefault };

  private readonly SUCCESS_MESSAGE_DURATION_MS = 1200;

  constructor(private teilVorlageService: TeilVorlageService, private elRef: ElementRef) {}

  ngOnInit(): void {
    this.loadTeile();
    this.loadAllNamen();

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
    this.loadTeile();
  }

  onHerstellerChange(): void {
    this.loadTeile();
  }

  clearFilters(): void {
    this.selectedFahrradKategorie = '';
    this.selectedKategorie = '';
    this.selectedHersteller = '';
    this.suchbegriff = '';
    this.showAutocomplete = false;
    this.loadTeile();
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
  }

  enrichTeil(): void {
    if (!this.newTeil.name?.trim()) {
      this.enrichError = 'Bitte zuerst einen Namen eingeben.';
      return;
    }
    this.enriching = true;
    this.enrichError = null;
    this.teilVorlageService.enrich(this.newTeil).subscribe({
      next: (enriched) => {
        this.newTeil = { ...enriched };
        this.enriching = false;
      },
      error: () => {
        this.enrichError = 'KI-Anreicherung fehlgeschlagen. Bitte Felder manuell ausfüllen.';
        this.enriching = false;
      }
    });
  }

  saveTeil(): void {
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
