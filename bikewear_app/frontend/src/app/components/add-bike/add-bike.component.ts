import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Bike } from '../../models/bike';
import { BikeCategory } from '../../models/bike-category';
import { BikeService } from '../../services/bike.service';

@Component({
  selector: 'app-add-bike',
  templateUrl: './add-bike.component.html',
  styleUrls: ['./add-bike.component.css']
})
export class AddBikeComponent {
  categories = Object.values(BikeCategory);
  error = '';
  saving = false;

  bike: Partial<Bike> = {
    name: '',
    kategorie: BikeCategory.Rennrad,
    kilometerstand: 0,
    stravaId: ''
  };

  constructor(private bikeService: BikeService, private router: Router) {}

  save(): void {
    if (!this.bike.name?.trim()) {
      this.error = 'Bitte einen Namen angeben.';
      return;
    }
    this.saving = true;
    this.bikeService.addBike(this.bike as Bike).subscribe({
      next: created => {
        this.router.navigate(['/bikes', created.id]);
      },
      error: () => {
        this.error = 'Fehler beim Speichern des Rads.';
        this.saving = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/bikes']);
  }
}
