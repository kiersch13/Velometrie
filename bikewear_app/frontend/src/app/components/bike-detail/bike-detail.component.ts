import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Bike } from '../../models/bike';
import { BikeCategory } from '../../models/bike-category';
import { WearPart } from '../../models/wear-part';
import { BikeService } from '../../services/bike.service';
import { WearPartService } from '../../services/wear-part.service';
import { LifetimeSettingsService } from '../../services/lifetime-settings.service';

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

  showWearPartForm = false;

  editingWearPart: WearPart | null = null;

  // Bike edit modal
  showBikeEditModal = false;
  readonly bikeCategories = Object.values(BikeCategory);
  editBikeName = '';
  editBikeKategorie: BikeCategory = BikeCategory.Rennrad;
  editBikeKilometerstand = 0;

  weeklyAvgKm: number | null = null;

  // Delete wear part confirmation modal
  showDeleteModal = false;
  deleteModalPartId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bikeService: BikeService,
    private wearPartService: WearPartService,
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
      next: parts => this.wearParts = parts,
      error: () => this.error = 'Fehler beim Laden der Verschleißteile.'
    });
  }

  openBikeEdit(): void {
    if (!this.bike) return;
    this.editBikeName = this.bike.name;
    this.editBikeKategorie = this.bike.kategorie;
    this.editBikeKilometerstand = this.bike.kilometerstand;
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
      kilometerstand: this.editBikeKilometerstand
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

  onEditKategorieChange(): void {
    if (this.editingWearPart) {
      this.editingWearPart.position = null;
    }
  }

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
    const lifetime = this.lifetimeService.getLifetime(part.kategorie);
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
    return part.einbauKilometerstand + this.lifetimeService.getLifetime(part.kategorie);
  }

  getLifetimePercent(part: WearPart): number {
    const lifetime = this.lifetimeService.getLifetime(part.kategorie);
    if (lifetime <= 0) return 0;
    return this.getGefahreneKm(part) / lifetime;
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
