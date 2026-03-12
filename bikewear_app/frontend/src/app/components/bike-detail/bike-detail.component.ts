import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Bike } from '../../models/bike';
import { BikeCategory } from '../../models/bike-category';
import { WearPart, MoveWearPartRequest } from '../../models/wear-part';
import { WearPartCategory } from '../../models/wear-part-category';
import { WearPartGruppe } from '../../models/wear-part-gruppe';
import { ServiceEintrag, ServiceTyp } from '../../models/service-eintrag';
import { BikeService } from '../../services/bike.service';
import { WearPartService } from '../../services/wear-part.service';
import { WearPartGruppeService } from '../../services/wear-part-gruppe.service';
import { ServiceEintragService } from '../../services/service-eintrag.service';
import { LifetimeSettingsService } from '../../services/lifetime-settings.service';
import { FederungServiceSettings } from '../../models/lifetime-settings';

@Component({
  selector: 'app-bike-detail',
  templateUrl: './bike-detail.component.html',
  styleUrls: ['./bike-detail.component.css']
})
export class BikeDetailComponent implements OnInit {
  private readonly bikePhotoMaxDimension = 1920;
  private readonly bikePhotoTargetBytes = 1_000_000;
  private readonly bikePhotoStartQuality = 0.82;
  private readonly bikePhotoMinQuality = 0.6;

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
  editBikeIndoorKilometerstand = 0;

  // Bike Fit modal
  showBikeFitModal = false;
  fitSattelhoehe: number | null = null;
  fitSattelversatz: number | null = null;
  fitVorbaulaenge: number | null = null;
  fitVorbauwinkel: number | null = null;
  fitKurbellaenge: number | null = null;
  fitLenkerbreite: number | null = null;
  fitSpacer: number | null = null;
  fitReach: number | null = null;
  fitStack: number | null = null;
  fitRadstand: number | null = null;

  weeklyAvgKm: number | null = null;
  loadingOdometerEdit = false;
  loadingOdometerAusbauEdit = false;
  photoUploading = false;
  photoError = '';

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

  // Move part modal state
  showMoveModal = false;
  movePartId: number | null = null;
  movePartName = '';
  moveZielRadId: number | null = null;
  moveAusbauKm = 0;
  moveAusbauDatumStr = '';
  moveEinbauKm = 0;
  moveEinbauDatumStr = '';
  moveAusbauFahrstunden: number | null = null;
  moveEinbauFahrstunden: number | null = null;
  moveIsFederung = false;
  userBikes: Bike[] = [];
  loadingMoveAusbauOdometer = false;
  loadingMoveEinbauOdometer = false;

  // Groups
  gruppen: WearPartGruppe[] = [];
  showAddGruppe = false;
  newGruppeName = '';
  editingGruppeId: number | null = null;
  editingGruppeName = '';

  // History modal
  showHistoryModal = false;
  historyParts: WearPart[] = [];
  historyBikes: { [radId: number]: Bike } = {};
  historyPartName = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bikeService: BikeService,
    private wearPartService: WearPartService,
    private wearPartGruppeService: WearPartGruppeService,
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
        this.loadGruppen(id);
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
    this.editBikeIndoorKilometerstand = this.bike.indoorKilometerstand;
    this.showBikeEditModal = true;
  }

  getBikePhotoUrl(bike: Bike): string {
    const updatedAt = bike.fotoAktualisiertAm ? new Date(bike.fotoAktualisiertAm).getTime() : 0;
    return `${this.bikeService.getBikePhotoUrl(bike.id)}?v=${updatedAt}`;
  }

  onBikePhotoSelected(event: Event): void {
    if (!this.bike) return;

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.photoUploading = true;
    this.photoError = '';
    this.optimizeBikePhoto(file)
      .then(optimizedFile => {
        if (!this.bike) {
          this.photoUploading = false;
          input.value = '';
          return;
        }

        this.bikeService.uploadBikePhoto(this.bike.id, optimizedFile).subscribe({
          next: updated => {
            this.bike = updated;
            this.photoUploading = false;
            input.value = '';
          },
          error: () => {
            this.photoError = 'Foto konnte nicht hochgeladen werden.';
            this.photoUploading = false;
            input.value = '';
          }
        });
      })
      .catch(() => {
        this.photoError = 'Foto konnte nicht verarbeitet werden.';
        this.photoUploading = false;
        input.value = '';
      });
  }

  private async optimizeBikePhoto(file: File): Promise<File> {
    if (!file.type.startsWith('image/')) {
      return file;
    }

    const image = await this.loadImage(file);
    const dimensions = this.scaleImageDimensions(image.width, image.height, this.bikePhotoMaxDimension);
    const canvas = document.createElement('canvas');
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas context not available');
    }

    context.drawImage(image, 0, 0, dimensions.width, dimensions.height);

    let outputType = file.type === 'image/webp' || file.type === 'image/png' ? 'image/webp' : 'image/jpeg';
    let quality = this.bikePhotoStartQuality;
    let blob: Blob;

    try {
      blob = await this.canvasToBlob(canvas, outputType, quality);
    } catch {
      outputType = 'image/jpeg';
      blob = await this.canvasToBlob(canvas, outputType, quality);
    }

    while (blob.size > this.bikePhotoTargetBytes && quality > this.bikePhotoMinQuality) {
      quality = Math.max(this.bikePhotoMinQuality, quality - 0.08);
      blob = await this.canvasToBlob(canvas, outputType, quality);
    }

    const isSameDimensions = dimensions.width === image.width && dimensions.height === image.height;
    if (isSameDimensions && blob.size >= file.size) {
      return file;
    }

    const baseName = file.name.replace(/\.[^.]+$/, '');
    const extension = outputType === 'image/webp' ? 'webp' : 'jpg';
    const optimizedName = `${baseName || 'bike-photo'}.${extension}`;

    return new File([blob], optimizedName, {
      type: outputType,
      lastModified: Date.now()
    });
  }

  private scaleImageDimensions(width: number, height: number, maxDimension: number): { width: number; height: number } {
    const largestSide = Math.max(width, height);
    if (largestSide <= maxDimension) {
      return { width, height };
    }

    const scale = maxDimension / largestSide;
    return {
      width: Math.max(1, Math.round(width * scale)),
      height: Math.max(1, Math.round(height * scale))
    };
  }

  private loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const objectUrl = URL.createObjectURL(file);

      image.onload = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(image);
      };

      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Image could not be loaded'));
      };

      image.src = objectUrl;
    });
  }

  private canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas export failed'));
        }
      }, type, quality);
    });
  }

  removeBikePhoto(): void {
    if (!this.bike || !this.bike.fotoStorageKey) return;

    this.photoUploading = true;
    this.photoError = '';
    this.bikeService.deleteBikePhoto(this.bike.id).subscribe({
      next: updated => {
        this.bike = updated;
        this.photoUploading = false;
      },
      error: () => {
        this.photoError = 'Foto konnte nicht gelöscht werden.';
        this.photoUploading = false;
      }
    });
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
      fahrstunden: this.editBikeFahrstunden,
      indoorKilometerstand: this.editBikeIndoorKilometerstand
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
      if (this.bike) {
        this.loadingOdometerEdit = true;
        this.bikeService.getOdometerAt(this.bike.id, val).subscribe({
          next: (km) => {
            this.editingWearPart!.einbauKilometerstand = km;
            this.loadingOdometerEdit = false;
          },
          error: () => {
            this.loadingOdometerEdit = false;
          }
        });
      }
    }
  }

  get editAusbauDatumStr(): string {
    if (!this.editingWearPart?.ausbauDatum) return '';
    return new Date(this.editingWearPart.ausbauDatum).toISOString().substring(0, 10);
  }

  set editAusbauDatumStr(val: string) {
    if (this.editingWearPart) {
      this.editingWearPart.ausbauDatum = val ? new Date(val) : null;
      if (val && this.bike) {
        this.loadingOdometerAusbauEdit = true;
        this.bikeService.getOdometerAt(this.bike.id, val).subscribe({
          next: (km) => {
            this.editingWearPart!.ausbauKilometerstand = km;
            this.loadingOdometerAusbauEdit = false;
          },
          error: () => {
            this.loadingOdometerAusbauEdit = false;
          }
        });
      }
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
        let km = part.ausbauKilometerstand - part.einbauKilometerstand;
        if (part.indoorIgnorieren && part.ausbauIndoorKilometerstand != null) {
          km -= (part.ausbauIndoorKilometerstand - part.einbauIndoorKilometerstand);
        }
        return Math.max(0, km);
      }
      return 0;
    }
    let km = (this.bike?.kilometerstand ?? part.einbauKilometerstand) - part.einbauKilometerstand;
    if (part.indoorIgnorieren && this.bike) {
      km -= (this.bike.indoorKilometerstand - part.einbauIndoorKilometerstand);
    }
    return Math.max(0, km);
  }

  getExpectedReplacementKm(part: WearPart): number {
    const bikeKat = this.bike?.kategorie ?? BikeCategory.Rennrad;
    return this.lifetimeService.getLifetime(part.kategorie, bikeKat);
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

  // ── Groups ──────────────────────────────────────────────────────────────

  loadGruppen(radId: number): void {
    this.wearPartGruppeService.getByBike(radId).subscribe({
      next: gruppen => this.gruppen = gruppen,
      error: () => this.gruppen = []
    });
  }

  getGruppeName(gruppeId: number | null): string | null {
    if (gruppeId == null) return null;
    return this.gruppen.find(g => g.id === gruppeId)?.name ?? null;
  }

  getPartsInGroup(gruppeId: number): WearPart[] {
    return this.sortedWearParts.filter(p => p.gruppeId === gruppeId);
  }

  getUngroupedParts(): WearPart[] {
    return this.sortedWearParts.filter(p => p.gruppeId == null);
  }

  openAddGruppe(): void {
    this.showAddGruppe = true;
    this.newGruppeName = '';
  }

  cancelAddGruppe(): void {
    this.showAddGruppe = false;
  }

  saveGruppe(): void {
    if (!this.bike || !this.newGruppeName.trim()) return;
    const gruppe: any = { name: this.newGruppeName.trim(), radId: this.bike.id };
    this.wearPartGruppeService.add(gruppe).subscribe({
      next: () => {
        this.showAddGruppe = false;
        this.loadGruppen(this.bike!.id);
      },
      error: () => this.error = 'Fehler beim Erstellen der Gruppe.'
    });
  }

  startEditGruppe(gruppe: WearPartGruppe): void {
    this.editingGruppeId = gruppe.id;
    this.editingGruppeName = gruppe.name;
  }

  cancelEditGruppe(): void {
    this.editingGruppeId = null;
  }

  saveEditGruppe(gruppe: WearPartGruppe): void {
    if (!this.editingGruppeName.trim()) return;
    this.wearPartGruppeService.update(gruppe.id, { ...gruppe, name: this.editingGruppeName.trim() }).subscribe({
      next: () => {
        this.editingGruppeId = null;
        this.loadGruppen(this.bike!.id);
      },
      error: () => this.error = 'Fehler beim Speichern der Gruppe.'
    });
  }

  deleteGruppe(gruppeId: number): void {
    this.wearPartGruppeService.delete(gruppeId).subscribe({
      next: () => {
        this.loadGruppen(this.bike!.id);
        this.loadWearParts(this.bike!.id);
      },
      error: () => this.error = 'Fehler beim Löschen der Gruppe.'
    });
  }

  assignToGroup(part: WearPart, gruppeId: number | null): void {
    const updated = { ...part, gruppeId };
    this.wearPartService.updateWearPart(part.id, updated).subscribe({
      next: () => this.loadWearParts(this.bike!.id),
      error: () => this.error = 'Fehler beim Zuweisen der Gruppe.'
    });
  }

  // ── Move part ───────────────────────────────────────────────────────────

  openMoveModal(part: WearPart): void {
    this.movePartId = part.id;
    this.movePartName = part.name;
    this.moveIsFederung = part.kategorie === WearPartCategory.Federung;
    this.moveAusbauKm = this.bike?.kilometerstand ?? 0;
    this.moveAusbauDatumStr = new Date().toISOString().substring(0, 10);
    this.moveEinbauKm = 0;
    this.moveEinbauDatumStr = new Date().toISOString().substring(0, 10);
    this.moveAusbauFahrstunden = this.moveIsFederung ? (this.bike?.fahrstunden ?? null) : null;
    this.moveEinbauFahrstunden = null;
    this.moveZielRadId = null;
    this.showMoveModal = true;

    // Load all user bikes (except the current one)
    this.bikeService.getBikes().subscribe({
      next: bikes => this.userBikes = bikes.filter(b => b.id !== this.bike?.id),
      error: () => this.userBikes = []
    });
  }

  closeMoveModal(): void {
    this.showMoveModal = false;
    this.movePartId = null;
  }

  onMoveAusbauDatumChange(): void {
    if (this.moveAusbauDatumStr && this.bike) {
      this.loadingMoveAusbauOdometer = true;
      this.bikeService.getOdometerAt(this.bike.id, this.moveAusbauDatumStr).subscribe({
        next: km => { this.moveAusbauKm = km; this.loadingMoveAusbauOdometer = false; },
        error: () => this.loadingMoveAusbauOdometer = false
      });
    }
  }

  onMoveEinbauDatumChange(): void {
    if (this.moveEinbauDatumStr && this.moveZielRadId) {
      this.loadingMoveEinbauOdometer = true;
      this.bikeService.getOdometerAt(this.moveZielRadId, this.moveEinbauDatumStr).subscribe({
        next: km => { this.moveEinbauKm = km; this.loadingMoveEinbauOdometer = false; },
        error: () => this.loadingMoveEinbauOdometer = false
      });
    }
  }

  onMoveZielRadChange(): void {
    // Auto-fetch target bike odometer on target change
    this.onMoveEinbauDatumChange();
  }

  confirmMove(): void {
    if (this.movePartId == null || this.moveZielRadId == null) return;
    const request: MoveWearPartRequest = {
      zielRadId: this.moveZielRadId,
      ausbauKilometerstand: this.moveAusbauKm,
      ausbauDatum: new Date(this.moveAusbauDatumStr),
      einbauKilometerstand: this.moveEinbauKm,
      einbauDatum: new Date(this.moveEinbauDatumStr),
      ausbauFahrstunden: this.moveAusbauFahrstunden,
      einbauFahrstunden: this.moveEinbauFahrstunden,
    };
    this.wearPartService.moveWearPart(this.movePartId, request).subscribe({
      next: () => {
        this.showMoveModal = false;
        this.editingWearPart = null;
        this.detailWearPart = null;
        this.movePartId = null;
        if (this.bike) this.loadWearParts(this.bike.id);
      },
      error: () => this.error = 'Fehler beim Verschieben des Teils.'
    });
  }

  // ── History ─────────────────────────────────────────────────────────────

  openHistory(part: WearPart): void {
    this.historyPartName = part.name;
    this.historyParts = [];
    this.historyBikes = {};
    this.showHistoryModal = true;
    this.wearPartService.getWearPartHistory(part.id).subscribe({
      next: parts => {
        this.historyParts = parts;
        // Load bike info for all unique radIds
        const radIds = [...new Set(parts.map(p => p.radId))];
        radIds.forEach(radId => {
          this.bikeService.getBike(radId).subscribe({
            next: bike => this.historyBikes[radId] = bike,
            error: () => {}
          });
        });
      },
      error: () => this.error = 'Fehler beim Laden der Historie.'
    });
  }

  closeHistory(): void {
    this.showHistoryModal = false;
  }

  hasHistory(part: WearPart): boolean {
    return part.vorgaengerId != null;
  }

  // ── Bike Fit ─────────────────────────────────────────────────────────

  hasBikeFitData(): boolean {
    if (!this.bike) return false;
    return this.bike.sattelhoehe != null || this.bike.sattelversatz != null ||
           this.bike.vorbaulaenge != null || this.bike.vorbauwinkel != null ||
           this.bike.kurbellaenge != null || this.bike.lenkerbreite != null ||
           this.bike.spacer != null || this.bike.reach != null ||
           this.bike.stack != null || this.bike.radstand != null;
  }

  openBikeFitEdit(): void {
    if (!this.bike) return;
    this.fitSattelhoehe = this.bike.sattelhoehe;
    this.fitSattelversatz = this.bike.sattelversatz;
    this.fitVorbaulaenge = this.bike.vorbaulaenge;
    this.fitVorbauwinkel = this.bike.vorbauwinkel;
    this.fitKurbellaenge = this.bike.kurbellaenge;
    this.fitLenkerbreite = this.bike.lenkerbreite;
    this.fitSpacer = this.bike.spacer;
    this.fitReach = this.bike.reach;
    this.fitStack = this.bike.stack;
    this.fitRadstand = this.bike.radstand;
    this.showBikeFitModal = true;
  }

  closeBikeFitEdit(): void {
    this.showBikeFitModal = false;
  }

  saveBikeFitEdit(): void {
    if (!this.bike) return;
    const updatedBike: Bike = {
      ...this.bike,
      sattelhoehe: this.fitSattelhoehe,
      sattelversatz: this.fitSattelversatz,
      vorbaulaenge: this.fitVorbaulaenge,
      vorbauwinkel: this.fitVorbauwinkel,
      kurbellaenge: this.fitKurbellaenge,
      lenkerbreite: this.fitLenkerbreite,
      spacer: this.fitSpacer,
      reach: this.fitReach,
      stack: this.fitStack,
      radstand: this.fitRadstand,
    };
    this.bikeService.updateBike(this.bike.id, updatedBike).subscribe({
      next: updated => {
        this.bike = updated;
        this.showBikeFitModal = false;
      },
      error: () => this.error = 'Fehler beim Speichern der Bike-Fit-Daten.'
    });
  }
}
