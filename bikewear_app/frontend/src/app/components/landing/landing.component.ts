import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  constructor(private router: Router, public authService: AuthService) {}

  enter(): void {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/bikes']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
