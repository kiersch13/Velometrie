import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  loading = false;
  error = '';
  success = '';
  showConfirm = false;

  constructor(public authService: AuthService) {}

  connectWithStrava(): void {
    this.loading = true;
    this.error = '';
    this.authService.getStravaRedirectUrl().subscribe({
      next: ({ url }) => {
        window.location.href = url;
      },
      error: () => {
        this.loading = false;
        this.error = 'Strava-Verbindung konnte nicht gestartet werden. Bitte Backend prüfen und erneut versuchen.';
      }
    });
  }

  disconnect(): void {
    this.loading = true;
    this.error = '';
    this.success = '';
    // disconnect() clears local state immediately — subscribe just waits for backend
    this.authService.disconnect().subscribe({
      next: () => {
        this.loading = false;
        this.showConfirm = false;
      }
    });
  }

  reload(): void {
    window.location.reload();
  }
}
