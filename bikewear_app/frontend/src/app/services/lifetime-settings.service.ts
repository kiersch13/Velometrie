import { Injectable } from '@angular/core';
import { WearPartCategory } from '../models/wear-part-category';
import { BikeCategory } from '../models/bike-category';
import { LifetimeSettings, FederungServiceSettings, defaultLifetimeSettings } from '../models/lifetime-settings';

@Injectable({
  providedIn: 'root'
})
export class LifetimeSettingsService {
  private readonly STORAGE_KEY = 'bikewear_lifetime_settings';

  getSettings(): LifetimeSettings {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Migrate from old flat format { Reifen: 5000, ... }
        if (parsed && !parsed.km) {
          return this.migrateOldFormat(parsed);
        }
        return this.mergeWithDefaults(parsed);
      } catch {
        return this.cloneDefaults();
      }
    }
    return this.cloneDefaults();
  }

  saveSettings(settings: LifetimeSettings): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
  }

  /** Get km lifetime for a specific part category on a specific bike category. */
  getLifetime(kategorie: WearPartCategory, bikeKategorie: BikeCategory): number {
    const settings = this.getSettings();
    return settings.km[bikeKategorie]?.[kategorie]
      ?? defaultLifetimeSettings.km[bikeKategorie]?.[kategorie]
      ?? 10000;
  }

  /** Get Federung service intervals in hours. */
  getFederungServiceSettings(): FederungServiceSettings {
    const settings = this.getSettings();
    return settings.federungService ?? defaultLifetimeSettings.federungService;
  }

  private cloneDefaults(): LifetimeSettings {
    return JSON.parse(JSON.stringify(defaultLifetimeSettings));
  }

  /**
   * Migrate old flat format { Reifen: 5000, Kette: 3000, ... }
   * to new per-BikeCategory format.
   */
  private migrateOldFormat(old: Record<string, number>): LifetimeSettings {
    const settings = this.cloneDefaults();
    // Apply old values to all bike categories
    for (const cat of Object.values(WearPartCategory)) {
      if (old[cat] != null) {
        for (const bike of Object.values(BikeCategory)) {
          settings.km[bike][cat] = old[cat];
        }
      }
    }
    // Save migrated format
    this.saveSettings(settings);
    return settings;
  }

  private mergeWithDefaults(parsed: Partial<LifetimeSettings>): LifetimeSettings {
    const result = this.cloneDefaults();
    if (parsed.km) {
      for (const bike of Object.values(BikeCategory)) {
        if (parsed.km[bike]) {
          for (const cat of Object.values(WearPartCategory)) {
            if (parsed.km[bike][cat] != null) {
              result.km[bike][cat] = parsed.km[bike][cat];
            }
          }
        }
      }
    }
    if (parsed.federungService) {
      if (parsed.federungService.kleinerService != null) {
        result.federungService.kleinerService = parsed.federungService.kleinerService;
      }
      if (parsed.federungService.grosserService != null) {
        result.federungService.grosserService = parsed.federungService.grosserService;
      }
    }
    return result;
  }
}
