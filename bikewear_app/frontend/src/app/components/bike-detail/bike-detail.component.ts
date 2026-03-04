import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Bike } from '../../models/bike';
import { BikeCategory } from '../../models/bike-category';
import { WearPart } from '../../models/wear-part';
import { WearPartCategory } from '../../models/wear-part-category';
import { ServiceEintrag, ServiceTyp } from '../../models/service-eintrag';
import { BikeService } from '../../services/bike.service';
import { WearPartService } from '../../services/wear-part.service';
import { ServiceEintragService } from '../../services/service-eintrag.service';
import { LifetimeSettingsService } from '../../services/lifetime-settings.service';
import { FederungServiceSettings } from '../../models/lifetime-settings';

@Component({
  selector: 'app-bike-detail',
  templateUrl: './bike-detail.component.html',
  styleUrls: ['./bike-detail.component.css']
})
export class BikeDetailComponent implements OnInit {
  bike: Bike | null = null;
  wearParts: WearPart[] = [];
  loading = false;
  error = '';
  Math = Math;

  showWearPartForm = false;

  editingWearPart: WearPart | null = null;

  // Wear part detail modal
  detailWearPart: WearPart | null = null;

  // Bike edit modal
  showBikeEditModal = false;
  readonly bikeCategories = Object.values(BikeCategory);
  editBikeName = '';
  editBikeKategorie: BikeCategory = BikeCategory.Rennrad;
  editBikeKilometerstand = 0;
  editBikeFahrstunden = 0;

  weeklyAvgKm: number | null = null;

  // Delete wear part confirmation modal
  showDeleteModal = false;
  deleteModalPartId: number | null = null;

  // Service entries per wear part (for Federung)
  serviceEntriesMap: { [wearPartId: number]: ServiceEintrag[] } = {};
  readonly ServiceTyp = ServiceTyp;
  readonly WearPartCategory = WearPartCategory;

  // Add service form state
  showAddServiceForm: number | null = null; // wearPartId
  newServiceTyp: ServiceTyp = ServiceTyp.KleinerService;
  newServiceDatum: string = '';
  newServiceNotizen: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bikeService: BikeService,
    private wearPartService: WearPartService,
    private serviceEintragService: ServiceEintragService,
    private lifetimeService: LifetimeSettingsService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    this.bikeService.getBike(id).subscribe({
      next: bike => {
        this.bike = bike;
        this.loading = false;
        this.loadWearParts(id);
        this.bikeService.getWeeklyAvgKm(id).subscribe({
          next: avg => this.weeklyAvgKm = avg,
          error: () => this.weeklyAvgKm = null
        });
      },
      error: () => {
        this.error = 'Rad nicht gefunden.';
        this.loading = false;
      }
    });
  }

  loadWearParts(radId: number): void {
    this.wearPartService.getWearPartsByBike(radId).subscribe({
      next: parts => {
        this.wearParts = parts;
        // Load service entries for all Federung parts
        parts.filter(p => p.kategorie === WearPartCategory.Federung).forEach(p => {
          this.loadServiceEntries(p.id);
        });
      },
      error: () => this.error = 'Fehler beim Laden der Verschleißteile.'
    });
  }

  loadServiceEntries(wearPartId: number): void {
    this.serviceEintragService.getByWearPart(wearPartId).subscribe({
      next: entries => this.serviceEntriesMap[wearPartId] = entries,
      error: () => this.serviceEntriesMap[wearPartId] = []
    });
  }

  openBikeEdit(): void {
    if (!this.bike) return;
    this.editBikeName = this.bike.name;
    this.editBikeKategorie = this.bike.kategorie;
    this.editBikeKilometerstand = this.bike.kilometerstand;
    this.editBikeFahrstunden = this.bike.fahrstunden;
    this.showBikeEditModal = true;
  }

  closeBikeEdit(): void {
    this.showBikeEditModal = false;
  }

  saveBikeEdit(): void {
    if (!this.bike) return;
    const updatedBike: Bike = {
      ...this.bike,
      name: this.editBikeName,
      kategorie: this.editBikeKategorie,
      kilometerstand: this.editBikeKilometerstand,
      fahrstunden: this.editBikeFahrstunden
    };
    this.bikeService.updateBike(this.bike.id, updatedBike).subscribe({
      next: updated => {
        this.bike = updated;
        this.showBikeEditModal = false;
      },
      error: () => this.error = 'Fehler beim Speichern des Rades.'
    });
  }

  deleteBike(): void {
    if (!this.bike) return;
    this.bikeService.deleteBike(this.bike.id).subscribe({
      next: () => this.router.navigate(['/bikes']),
      error: () => this.error = 'Fehler beim Löschen des Rades.'
    });
  }

  onWearPartAdded(): void {
    this.showWearPartForm = false;
    if (this.bike) this.loadWearParts(this.bike.id);
  }

  startEditWearPart(part: WearPart): void {
    this.editingWearPart = { ...part };
  }

  openWearPartDetail(part: WearPart): void {
    this.detailWearPart = part;
  }

  closeWearPartDetail(): void {
    this.detailWearPart = null;
  }

  onEditKategorieChange(): void {
    if (this.editingWearPart) {
      this.editingWearPart.position = null;
    }
  }

  // ── Reifen-Edit: Konvertierung Breite & Druck ──────────────────────────────

  onEditReifenBreiteMmChange(): void {
    if (!this.editingWearPart) return;
    const mm = this.editingWearPart.reifenBreiteMm;
    if (mm != null && !isNaN(mm)) {
      this.editingWearPart.reifenBreiteZoll = Math.round((mm / 25.4) * 10) / 10;
    } else {
      this.editingWearPart.reifenBreiteZoll = null;
    }
  }

  onEditReifenBreiteZollChange(): void {
    if (!this.editingWearPart) return;
    const zoll = this.editingWearPart.reifenBreiteZoll;
    if (zoll != null && !isNaN(zoll)) {
      this.editingWearPart.reifenBreiteMm = Math.round(zoll * 25.4);
    } else {
      this.editingWearPart.reifenBreiteMm = null;
    }
  }

  onEditReifenDruckBarChange(): void {
    if (!this.editingWearPart) return;
    const bar = this.editingWearPart.reifenDruckBar;
    if (bar != null && !isNaN(bar)) {
      this.editingWearPart.reifenDruckPsi = Math.round(bar * 14.5038);
    } else {
      this.editingWearPart.reifenDruckPsi = null;
    }
  }

  onEditReifenDruckPsiChange(): void {
    if (!this.editingWearPart) return;
    const psi = this.editingWearPart.reifenDruckPsi;
    if (psi != null && !isNaN(psi)) {
      this.editingWearPart.reifenDruckBar = Math.round((psi / 14.5038) * 10) / 10;
    } else {
      this.editingWearPart.reifenDruckBar = null;
    }
  }

  /** Gibt eine kurze Konfigurationsübersicht für ein Verschleißteil zurück (z.B. Reifenbreite/-druck). */
  getPartConfigSummary(part: WearPart): string {
    const tokens: string[] = [];
    if (part.reifenBreiteMm != null) tokens.push(`${part.reifenBreiteMm} mm`);
    if (part.reifenDruckBar != null) tokens.push(`${part.reifenDruckBar} bar`);
    return tokens.length > 0 ? tokens.join(' · ') : '–';
  }

  // ──────────────────────────────────────────────────────────────────────────

  get editEinbauDatumStr(): string {
    if (!this.editingWearPart?.einbauDatum) return '';
    return new Date(this.editingWearPart.einbauDatum).toISOString().substring(0, 10);
  }

  set editEinbauDatumStr(val: string) {
    if (this.editingWearPart && val) {
      this.editingWearPart.einbauDatum = new Date(val);
    }
  }

  get editAusbauDatumStr(): string {
    if (!this.editingWearPart?.ausbauDatum) return '';
    return new Date(this.editingWearPart.ausbauDatum).toISOString().substring(0, 10);
  }

  set editAusbauDatumStr(val: string) {
    if (this.editingWearPart) {
      this.editingWearPart.ausbauDatum = val ? new Date(val) : null;
    }
  }

  saveWearPart(): void {
    if (!this.editingWearPart) return;
    this.wearPartService.updateWearPart(this.editingWearPart.id, this.editingWearPart).subscribe({
      next: () => {
        this.editingWearPart = null;
        if (this.bike) this.loadWearParts(this.bike.id);
      },
      error: () => this.error = 'Fehler beim Speichern des Verschleißteils.'
    });
  }

  deleteWearPart(id: number): void {
    this.wearPartService.deleteWearPart(id).subscribe({
      next: () => { if (this.bike) this.loadWearParts(this.bike.id); },
      error: () => this.error = 'Fehler beim Löschen des Verschleißteils.'
    });
  }

  openDeleteModal(id: number): void {
    this.deleteModalPartId = id;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.deleteModalPartId = null;
  }

  confirmDeleteWearPart(): void {
    if (this.deleteModalPartId == null) return;
    this.wearPartService.deleteWearPart(this.deleteModalPartId).subscribe({
      next: () => {
        this.showDeleteModal = false;
        this.deleteModalPartId = null;
        this.editingWearPart = null;
        if (this.bike) this.loadWearParts(this.bike.id);
      },
      error: () => {
        this.error = 'Fehler beim Löschen des Verschleißteils.';
        this.showDeleteModal = false;
        this.deleteModalPartId = null;
      }
    });
  }

  getExpectedAusbauDate(part: WearPart): Date | null {
    if (this.weeklyAvgKm == null || this.weeklyAvgKm <= 0) return null;
    if (part.kategorie === WearPartCategory.Federung) return null; // Federung uses hours, not date estimate
    const bikeKat = this.bike?.kategorie ?? BikeCategory.Rennrad;
    const lifetime = this.lifetimeService.getLifetime(part.kategorie, bikeKat);
    const gefahren = this.getGefahreneKm(part);
    const remaining = lifetime - gefahren;
    if (remaining <= 0) return new Date();
    const weeksUntil = remaining / this.weeklyAvgKm;
    const result = new Date();
    result.setDate(result.getDate() + Math.round(weeksUntil * 7));
    return result;
  }

  goBack(): void {
    this.router.navigate(['/bikes']);
  }

  isInstalled(part: WearPart): boolean {
    if (part.ausbauDatum == null) return true;
    return new Date(part.ausbauDatum) > new Date();
  }

  get sortedWearParts(): WearPart[] {
    const active = this.wearParts
      .filter(p => this.isInstalled(p))
      .sort((a, b) => new Date(b.einbauDatum).getTime() - new Date(a.einbauDatum).getTime());
    const inactive = this.wearParts
      .filter(p => !this.isInstalled(p))
      .sort((a, b) => {
        const dateA = a.ausbauDatum ? new Date(a.ausbauDatum).getTime() : 0;
        const dateB = b.ausbauDatum ? new Date(b.ausbauDatum).getTime() : 0;
        return dateB - dateA;
      });
    return [...active, ...inactive];
  }

  getGefahreneKm(part: WearPart): number {
    if (!this.isInstalled(part)) {
      if (part.ausbauKilometerstand != null && part.ausbauKilometerstand > 0) {
        return Math.max(0, part.ausbauKilometerstand - part.einbauKilometerstand);
      }
      return 0;
    }
    return Math.max(0, (this.bike?.kilometerstand ?? part.einbauKilometerstand) - part.einbauKilometerstand);
  }

  getExpectedReplacementKm(part: WearPart): number {
    const bikeKat = this.bike?.kategorie ?? BikeCategory.Rennrad;
    return part.einbauKilometerstand + this.lifetimeService.getLifetime(part.kategorie, bikeKat);
  }

  getLifetimePercent(part: WearPart): number {
    // For Federung parts, use hours-based progress
    if (part.kategorie === WearPartCategory.Federung) {
      return this.getFederungPercent(part);
    }
    const bikeKat = this.bike?.kategorie ?? BikeCategory.Rennrad;
    const lifetime = this.lifetimeService.getLifetime(part.kategorie, bikeKat);
    if (lifetime <= 0) return 0;
    return this.getGefahreneKm(part) / lifetime;
  }

  // ── Federung-specific helpers ───────────────────────────────────────────

  isFederung(part: WearPart): boolean {
    return part.kategorie === WearPartCategory.Federung;
  }

  /** Total hours on this Federung part since install. */
  getFederungStunden(part: WearPart): number {
    if (!this.bike || part.einbauFahrstunden == null) return 0;
    const currentHours = this.isInstalled(part)
      ? this.bike.fahrstunden
      : (part.ausbauFahrstunden ?? this.bike.fahrstunden);
    return Math.max(0, currentHours - part.einbauFahrstunden);
  }

  /** Hours since last small service (or since install if none). */
  getStundenSeitKleinemService(part: WearPart): number {
    const entries = this.serviceEntriesMap[part.id] ?? [];
    const lastSmall = entries
      .filter(e => e.serviceTyp === ServiceTyp.KleinerService || e.serviceTyp === ServiceTyp.GrosserService)
      .sort((a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime())[0];
    const refHours = lastSmall ? lastSmall.beiFahrstunden : (part.einbauFahrstunden ?? 0);
    const currentHours = this.isInstalled(part)
      ? (this.bike?.fahrstunden ?? 0)
      : (part.ausbauFahrstunden ?? this.bike?.fahrstunden ?? 0);
    return Math.max(0, currentHours - refHours);
  }

  /** Hours since last big service (or since install if none). */
  getStundenSeitGrossemService(part: WearPart): number {
    const entries = this.serviceEntriesMap[part.id] ?? [];
    const lastBig = entries
      .filter(e => e.serviceTyp === ServiceTyp.GrosserService)
      .sort((a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime())[0];
    const refHours = lastBig ? lastBig.beiFahrstunden : (part.einbauFahrstunden ?? 0);
    const currentHours = this.isInstalled(part)
      ? (this.bike?.fahrstunden ?? 0)
      : (part.ausbauFahrstunden ?? this.bike?.fahrstunden ?? 0);
    return Math.max(0, currentHours - refHours);
  }

  /** Federung service settings (kleiner/grosser Service intervals in hours). */
  get federungSettings(): FederungServiceSettings {
    return this.lifetimeService.getFederungServiceSettings();
  }

  /** Hours remaining until next small service. */
  getStundenBisKleinerService(part: WearPart): number {
    return Math.max(0, this.federungSettings.kleinerService - this.getStundenSeitKleinemService(part));
  }

  /** Hours remaining until next big service. */
  getStundenBisGrosserService(part: WearPart): number {
    return Math.max(0, this.federungSettings.grosserService - this.getStundenSeitGrossemService(part));
  }

  /** Get the closer service type and its progress percentage (for list view). */
  getFederungPercent(part: WearPart): number {
    const smallPct = this.federungSettings.kleinerService > 0
      ? this.getStundenSeitKleinemService(part) / this.federungSettings.kleinerService
      : 0;
    const bigPct = this.federungSettings.grosserService > 0
      ? this.getStundenSeitGrossemService(part) / this.federungSettings.grosserService
      : 0;
    return Math.max(smallPct, bigPct);
  }

  /** Label for the closest upcoming service on a Federung part. */
  getFederungNextServiceLabel(part: WearPart): string {
    const smallRemaining = this.getStundenBisKleinerService(part);
    const bigRemaining = this.getStundenBisGrosserService(part);
    if (bigRemaining <= smallRemaining) {
      return 'Großer Service';
    }
    return 'Kleiner Service';
  }

  /** Hours until the closest upcoming service. */
  getFederungNextServiceHours(part: WearPart): number {
    return Math.min(this.getStundenBisKleinerService(part), this.getStundenBisGrosserService(part));
  }

  /** Total accumulated hours display for list view. */
  getFederungAccumulatedHours(part: WearPart): number {
    const smallRemaining = this.getStundenBisKleinerService(part);
    const bigRemaining = this.getStundenBisGrosserService(part);
    if (bigRemaining <= smallRemaining) {
      return this.getStundenSeitGrossemService(part);
    }
    return this.getStundenSeitKleinemService(part);
  }

  /** Service interval for the next closest service. */
  getFederungNextServiceInterval(part: WearPart): number {
    const smallRemaining = this.getStundenBisKleinerService(part);
    const bigRemaining = this.getStundenBisGrosserService(part);
    if (bigRemaining <= smallRemaining) {
      return this.federungSettings.grosserService;
    }
    return this.federungSettings.kleinerService;
  }

  // ── Service entry CRUD ──────────────────────────────────────────────────

  openAddServiceForm(wearPartId: number): void {
    this.showAddServiceForm = wearPartId;
    this.newServiceTyp = ServiceTyp.KleinerService;
    this.newServiceDatum = new Date().toISOString().substring(0, 10);
    this.newServiceNotizen = '';
  }

  cancelAddService(): void {
    this.showAddServiceForm = null;
  }

  saveServiceEntry(): void {
    if (this.showAddServiceForm == null || !this.bike) return;
    const eintrag: any = {
      wearPartId: this.showAddServiceForm,
      serviceTyp: this.newServiceTyp,
      datum: new Date(this.newServiceDatum),
      beiFahrstunden: this.bike.fahrstunden,
      notizen: this.newServiceNotizen || null
    };
    this.serviceEintragService.add(eintrag).subscribe({
      next: () => {
        this.loadServiceEntries(this.showAddServiceForm!);
        this.showAddServiceForm = null;
      },
      error: () => this.error = 'Fehler beim Speichern des Service-Eintrags.'
    });
  }

  deleteServiceEntry(entryId: number, wearPartId: number): void {
    this.serviceEintragService.delete(entryId).subscribe({
      next: () => this.loadServiceEntries(wearPartId),
      error: () => this.error = 'Fehler beim Löschen des Service-Eintrags.'
    });
  }

  getStatusBarClass(part: WearPart): string {
    if (!this.isInstalled(part)) {
      return 'bg-gray-300 dark:bg-gray-600';
    }
    const pct = this.getLifetimePercent(part);
    if (pct >= 1.0) return 'bg-error/60';
    if (pct >= 0.8) return 'bg-warning/70';
    return 'bg-success/50';
  }
}
