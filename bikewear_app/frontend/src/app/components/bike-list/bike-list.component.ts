import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Bike } from '../../models/bike';
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

  deleteBike(id: number, event: MouseEvent): void {
    event.stopPropagation();
    this.bikeService.deleteBike(id).subscribe({
      next: () => { this.bikes = this.bikes.filter(b => b.id !== id); },
      error: () => { this.error = 'Fehler beim Löschen des Rades.'; }
    });
  }
}
