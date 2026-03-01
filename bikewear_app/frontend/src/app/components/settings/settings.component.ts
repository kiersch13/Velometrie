import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LifetimeSettingsService } from '../../services/lifetime-settings.service';
import { LifetimeSettings, defaultLifetimeSettings } from '../../models/lifetime-settings';
import { WearPartCategory } from '../../models/wear-part-category';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  loading = false;
  error = '';
  success = '';
  showConfirm = false;

  lifetimeSettings!: LifetimeSettings;
  lifetimeCategories: WearPartCategory[] = [
    WearPartCategory.Reifen,
    WearPartCategory.Kassette,
    WearPartCategory.Kettenblatt,
    WearPartCategory.Kette,
    WearPartCategory.Sonstiges
  ];
  lifetimeSaved = false;

  constructor(public authService: AuthService, private lifetimeService: LifetimeSettingsService) {}

  ngOnInit(): void {
    this.lifetimeSettings = this.lifetimeService.getSettings();
  }

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

  saveLifetimeSettings(): void {
    this.lifetimeService.saveSettings(this.lifetimeSettings);
    this.lifetimeSaved = true;
    setTimeout(() => this.lifetimeSaved = false, 2500);
  }

  resetLifetimeSettings(): void {
    this.lifetimeSettings = { ...defaultLifetimeSettings };
    this.lifetimeService.saveSettings(this.lifetimeSettings);
    this.lifetimeSaved = true;
    setTimeout(() => this.lifetimeSaved = false, 2500);
  }
}
