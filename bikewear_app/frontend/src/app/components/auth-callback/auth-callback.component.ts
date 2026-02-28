import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.css']
})
export class AuthCallbackComponent implements OnInit {
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const code = this.route.snapshot.queryParamMap.get('code');
    const errorParam = this.route.snapshot.queryParamMap.get('error');

    if (errorParam) {
      this.error = 'Strava-Zugriff verweigert.';
      return;
    }

    if (!code) {
      this.error = 'Kein Autorisierungscode erhalten.';
      return;
    }

    this.authService.exchangeCode(code).subscribe({
      next: () => this.router.navigate(['/bikes']),
      error: () => {
        this.error = 'Authentifizierung fehlgeschlagen. Bitte erneut versuchen.';
      }
    });
  }

  retry(): void {
    this.router.navigate(['/']);
  }
}
