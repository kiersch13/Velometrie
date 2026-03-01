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
    const stateFromUrl = this.route.snapshot.queryParamMap.get('state') ?? '';
    const errorParam = this.route.snapshot.queryParamMap.get('error');

    if (errorParam) {
      this.error = 'Strava-Zugriff verweigert.';
      return;
    }

    if (!code) {
      this.error = 'Kein Autorisierungscode erhalten.';
      return;
    }

    this.authService.connectStrava(code, stateFromUrl).subscribe({
      next: () => this.router.navigate(['/settings']),
      error: (err) => {
        const msg = err?.error ?? '';
        this.error = typeof msg === 'string' && msg
          ? msg
          : 'Strava-Verbindung fehlgeschlagen. Bitte erneut versuchen.';
      }
    });
  }

  retry(): void {
    this.router.navigate(['/settings']);
  }
}
