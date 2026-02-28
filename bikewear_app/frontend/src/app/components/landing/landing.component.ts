import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  stravaLoading = false;

  constructor(private router: Router, public authService: AuthService) {}

  enter(): void {
    this.router.navigate(['/bikes']);
  }

  connectWithStrava(): void {
    this.stravaLoading = true;
    this.authService.getStravaRedirectUrl().subscribe({
      next: ({ url }) => {
        window.location.href = url;
      },
      error: () => {
        this.stravaLoading = false;
      }
    });
  }
}
