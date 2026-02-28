import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Bike } from '../../models/bike';
import { BikeCategory } from '../../models/bike-category';
import { BikeService } from '../../services/bike.service';
import { AuthService } from '../../services/auth.service';
import { StravaGear } from '../../models/strava-gear';

@Component({
  selector: 'app-add-bike',
  templateUrl: './add-bike.component.html',
  styleUrls: ['./add-bike.component.css']
})
export class AddBikeComponent implements OnInit {
  categories = Object.values(BikeCategory);
  error = '';
  saving = false;

  stravaBikes: StravaGear[] = [];
  stravaBikesLoading = false;
  stravaBikesError = '';
  selectedStravaId = '';

  bike: Partial<Bike> = {
    name: '',
    kategorie: BikeCategory.Rennrad,
    kilometerstand: 0,
    stravaId: ''
  };

  constructor(
    private bikeService: BikeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser;
    if (user) {
      this.stravaBikesLoading = true;
      this.authService.getStravaBikes(user.id).subscribe({
        next: bikes => {
          this.stravaBikes = bikes;
          this.stravaBikesLoading = false;
        },
        error: (err: HttpErrorResponse) => {
          const msg = typeof err.error === 'string' ? err.error : 'Strava-Fahrräder konnten nicht geladen werden.';
          this.stravaBikesError = msg;
          this.stravaBikesLoading = false;
        }
      });
    }
  }

  selectStravaBike(gear: StravaGear): void {
    this.bike.name = gear.name;
    this.bike.kilometerstand = gear.kilometerstandKm;
    this.bike.stravaId = gear.id;
    this.selectedStravaId = gear.id;
  }

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
