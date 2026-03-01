import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Bike } from '../../models/bike';
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

  editingKm = false;
  newKilometerstand: number = 0;

  showWearPartForm = false;

  editingWearPart: WearPart | null = null;

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
        this.newKilometerstand = bike.kilometerstand;
        this.loading = false;
        this.loadWearParts(id);
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

  saveKilometerstand(): void {
    if (!this.bike) return;
    this.bikeService.updateKilometerstand(this.bike.id, this.newKilometerstand).subscribe({
      next: updated => {
        this.bike = updated;
        this.editingKm = false;
      },
      error: () => this.error = 'Fehler beim Speichern des Kilometerstands.'
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

  goBack(): void {
    this.router.navigate(['/bikes']);
  }

  isInstalled(part: WearPart): boolean {
    return part.ausbauKilometerstand == null && part.ausbauDatum == null;
  }

  getGefahreneKm(part: WearPart): number {
    if (part.ausbauKilometerstand != null) {
      return Math.max(0, part.ausbauKilometerstand - part.einbauKilometerstand);
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
      return 'bg-error/40';
    }
    const pct = this.getLifetimePercent(part);
    if (pct >= 0.8) {
      return 'bg-warning/70';
    }
    return 'bg-success/50';
  }
}
