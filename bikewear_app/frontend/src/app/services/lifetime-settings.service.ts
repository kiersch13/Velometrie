import { Injectable } from '@angular/core';
import { WearPartCategory } from '../models/wear-part-category';
import { LifetimeSettings, defaultLifetimeSettings } from '../models/lifetime-settings';

@Injectable({
  providedIn: 'root'
})
export class LifetimeSettingsService {
  private readonly STORAGE_KEY = 'bikewear_lifetime_settings';

  getSettings(): LifetimeSettings {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        return { ...defaultLifetimeSettings, ...JSON.parse(stored) };
      } catch {
        return { ...defaultLifetimeSettings };
      }
    }
    return { ...defaultLifetimeSettings };
  }

  saveSettings(settings: LifetimeSettings): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
  }

  getLifetime(kategorie: WearPartCategory): number {
    const settings = this.getSettings();
    return settings[kategorie] ?? defaultLifetimeSettings[WearPartCategory.Sonstiges];
  }
}
