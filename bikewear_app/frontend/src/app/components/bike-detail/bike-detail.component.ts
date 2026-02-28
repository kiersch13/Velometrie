import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Bike } from '../../models/bike';
import { WearPart } from '../../models/wear-part';
import { BikeService } from '../../services/bike.service';
import { WearPartService } from '../../services/wear-part.service';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bikeService: BikeService,
    private wearPartService: WearPartService
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

  onWearPartAdded(): void {
    this.showWearPartForm = false;
    if (this.bike) this.loadWearParts(this.bike.id);
  }

  goBack(): void {
    this.router.navigate(['/bikes']);
  }
}
