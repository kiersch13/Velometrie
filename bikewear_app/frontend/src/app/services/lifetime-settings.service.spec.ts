import { TestBed } from '@angular/core/testing';
import { LifetimeSettingsService } from './lifetime-settings.service';
import { WearPartCategory } from '../models/wear-part-category';
import { BikeCategory } from '../models/bike-category';
import { defaultLifetimeSettings } from '../models/lifetime-settings';

describe('LifetimeSettingsService', () => {
  let service: LifetimeSettingsService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [LifetimeSettingsService],
    });
    service = TestBed.inject(LifetimeSettingsService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('getSettings() returns default settings when localStorage is empty', () => {
    const settings = service.getSettings();

    expect(settings.km[BikeCategory.Rennrad][WearPartCategory.Reifen])
      .toBe(defaultLifetimeSettings.km[BikeCategory.Rennrad][WearPartCategory.Reifen]);
    expect(settings.km[BikeCategory.Mountainbike][WearPartCategory.Kette])
      .toBe(defaultLifetimeSettings.km[BikeCategory.Mountainbike][WearPartCategory.Kette]);
    expect(settings.federungService.kleinerService).toBe(50);
    expect(settings.federungService.grosserService).toBe(200);
  });

  it('saveSettings() persists settings to localStorage', () => {
    const customSettings = JSON.parse(JSON.stringify(defaultLifetimeSettings));
    customSettings.km[BikeCategory.Rennrad][WearPartCategory.Reifen] = 9999;

    service.saveSettings(customSettings);

    const stored = JSON.parse(localStorage.getItem('bikewear_lifetime_settings')!);
    expect(stored.km[BikeCategory.Rennrad][WearPartCategory.Reifen]).toBe(9999);
  });

  it('getSettings() returns previously saved settings from localStorage', () => {
    const customSettings = JSON.parse(JSON.stringify(defaultLifetimeSettings));
    customSettings.km[BikeCategory.Gravel][WearPartCategory.Kette] = 5000;
    service.saveSettings(customSettings);

    const result = service.getSettings();

    expect(result.km[BikeCategory.Gravel][WearPartCategory.Kette]).toBe(5000);
  });

  it('getSettings() falls back to defaults when localStorage contains invalid JSON', () => {
    localStorage.setItem('bikewear_lifetime_settings', 'not-valid-json');

    const result = service.getSettings();

    expect(result.km[BikeCategory.Rennrad][WearPartCategory.Reifen])
      .toBe(defaultLifetimeSettings.km[BikeCategory.Rennrad][WearPartCategory.Reifen]);
  });

  it('getSettings() migrates old flat format to new structure', () => {
    // Old format: flat { Reifen: 7777, Kette: 3000, ... }
    localStorage.setItem('bikewear_lifetime_settings', JSON.stringify({
      [WearPartCategory.Reifen]: 7777,
      [WearPartCategory.Kette]: 2222
    }));

    const result = service.getSettings();

    // Should apply to all bike categories
    expect(result.km[BikeCategory.Rennrad][WearPartCategory.Reifen]).toBe(7777);
    expect(result.km[BikeCategory.Gravel][WearPartCategory.Reifen]).toBe(7777);
    expect(result.km[BikeCategory.Mountainbike][WearPartCategory.Reifen]).toBe(7777);
    expect(result.km[BikeCategory.Rennrad][WearPartCategory.Kette]).toBe(2222);
    // Default federung service should still be set
    expect(result.federungService.kleinerService).toBe(50);
  });

  it('getLifetime() returns the correct value for category and bike category', () => {
    const customSettings = JSON.parse(JSON.stringify(defaultLifetimeSettings));
    customSettings.km[BikeCategory.Rennrad][WearPartCategory.Kassette] = 20000;
    service.saveSettings(customSettings);

    expect(service.getLifetime(WearPartCategory.Kassette, BikeCategory.Rennrad)).toBe(20000);
  });

  it('getLifetime() differentiates between bike categories', () => {
    const settings = service.getSettings();

    // Defaults should differ per bike category
    expect(service.getLifetime(WearPartCategory.Reifen, BikeCategory.Rennrad)).toBe(6000);
    expect(service.getLifetime(WearPartCategory.Reifen, BikeCategory.Gravel)).toBe(4000);
    expect(service.getLifetime(WearPartCategory.Reifen, BikeCategory.Mountainbike)).toBe(3000);
  });

  it('getFederungServiceSettings() returns correct service intervals', () => {
    const customSettings = JSON.parse(JSON.stringify(defaultLifetimeSettings));
    customSettings.federungService.kleinerService = 60;
    customSettings.federungService.grosserService = 250;
    service.saveSettings(customSettings);

    const result = service.getFederungServiceSettings();
    expect(result.kleinerService).toBe(60);
    expect(result.grosserService).toBe(250);
  });
});
