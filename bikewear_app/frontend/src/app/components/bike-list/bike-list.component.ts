import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Bike } from '../../models/bike';
import { BikeCategory } from '../../models/bike-category';
import { BikeService } from '../../services/bike.service';

@Component({
  selector: 'app-bike-list',
  templateUrl: './bike-list.component.html',
  styleUrls: ['./bike-list.component.css']
})
export class BikeListComponent implements OnInit {
  bikes: Bike[] = [];
  loading = false;
  error = '';

  constructor(private bikeService: BikeService, private router: Router) {}

  ngOnInit(): void {
    this.loadBikes();
  }

  loadBikes(): void {
    this.loading = true;
    this.bikeService.getBikes().subscribe({
      next: bikes => {
        this.bikes = bikes;
        this.loading = false;
      },
      error: err => {
        this.error = 'Fehler beim Laden der Räder.';
        this.loading = false;
      }
    });
  }

  openDetail(id: number): void {
    this.router.navigate(['/bikes', id]);
  }

  addBike(): void {
    this.router.navigate(['/bikes/add']);
  }

  getCategoryIcon(kategorie: BikeCategory): string {
    switch (kategorie) {
      case BikeCategory.Rennrad: return 'bike';
      case BikeCategory.Gravel:  return 'compass';
      case BikeCategory.Mountainbike: return 'mountain';
      default: return 'bike';
    }
  }

  getCategoryBorderClass(kategorie: BikeCategory): string {
    switch (kategorie) {
      case BikeCategory.Rennrad: return 'border-accent';
      case BikeCategory.Gravel:  return 'border-success';
      case BikeCategory.Mountainbike: return 'border-blue-600';
      default: return 'border-accent';
    }
  }

  getCategoryIconClass(kategorie: BikeCategory): string {
    switch (kategorie) {
      case BikeCategory.Rennrad: return 'text-accent/20';
      case BikeCategory.Gravel:  return 'text-success/20';
      case BikeCategory.Mountainbike: return 'text-blue-600/20';
      default: return 'text-accent/20';
    }
  }

  getCategoryBadgeClass(kategorie: BikeCategory): string {
    switch (kategorie) {
      case BikeCategory.Rennrad:
        return 'inline-block rounded-md px-2 py-0.5 text-xs font-medium bg-accent/10 text-accent';
      case BikeCategory.Gravel:
        return 'inline-block rounded-md px-2 py-0.5 text-xs font-medium bg-success/10 text-success';
      case BikeCategory.Mountainbike:
        return 'inline-block rounded-md px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'inline-block rounded-md px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600';
    }
  }
}
