import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  stravaId = '';
  accessToken = '';
  loading = false;
  error = '';
  success = '';

  constructor(public authService: AuthService) {}

  connect(): void {
    if (!this.stravaId.trim() || !this.accessToken.trim()) {
      this.error = 'Bitte Strava-ID und Access-Token eingeben.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.success = '';
    this.authService.connect(this.stravaId.trim(), this.accessToken.trim()).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Erfolgreich mit Strava verbunden.';
        this.stravaId = '';
        this.accessToken = '';
      },
      error: () => {
        this.loading = false;
        this.error = 'Verbindung fehlgeschlagen. Bitte Eingaben prüfen.';
      }
    });
  }

  disconnect(): void {
    this.loading = true;
    this.error = '';
    this.success = '';
    this.authService.disconnect().subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Strava-Verbindung getrennt.';
      },
      error: () => {
        this.loading = false;
        this.error = 'Trennung fehlgeschlagen.';
      }
    });
  }
}
