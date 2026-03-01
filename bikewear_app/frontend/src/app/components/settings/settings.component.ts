import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(
    public authService: AuthService,
    private lifetimeService: LifetimeSettingsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.lifetimeSettings = this.lifetimeService.getSettings();
  }

  connectWithStrava(): void {
    this.loading = true;
    this.error = '';
    this.authService.connectWithStrava().subscribe({
      next: ({ url, state }) => {
        sessionStorage.setItem('bikewear_strava_state', state);
        window.location.href = url;
      },
      error: () => {
        this.loading = false;
        this.error = 'Strava-Verbindung konnte nicht gestartet werden. Bitte erneut versuchen.';
      }
    });
  }

  disconnect(): void {
    this.loading = true;
    this.error = '';
    this.success = '';
    this.authService.disconnectStrava().subscribe({
      next: () => {
        this.loading = false;
        this.showConfirm = false;
        this.success = 'Strava-Verbindung getrennt.';
      },
      error: () => {
        this.loading = false;
        this.error = 'Trennen fehlgeschlagen. Bitte erneut versuchen.';
      }
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/'])
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
