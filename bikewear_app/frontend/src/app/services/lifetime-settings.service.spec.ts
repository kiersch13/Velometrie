import { TestBed } from '@angular/core/testing';
import { LifetimeSettingsService } from './lifetime-settings.service';
import { WearPartCategory } from '../models/wear-part-category';
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

    expect(settings[WearPartCategory.Reifen]).toBe(defaultLifetimeSettings[WearPartCategory.Reifen]);
    expect(settings[WearPartCategory.Kette]).toBe(defaultLifetimeSettings[WearPartCategory.Kette]);
    expect(settings[WearPartCategory.Kassette]).toBe(defaultLifetimeSettings[WearPartCategory.Kassette]);
    expect(settings[WearPartCategory.Kettenblatt]).toBe(defaultLifetimeSettings[WearPartCategory.Kettenblatt]);
    expect(settings[WearPartCategory.Sonstiges]).toBe(defaultLifetimeSettings[WearPartCategory.Sonstiges]);
  });

  it('saveSettings() persists settings to localStorage', () => {
    const customSettings = { ...defaultLifetimeSettings, [WearPartCategory.Reifen]: 9999 };

    service.saveSettings(customSettings);

    const stored = JSON.parse(localStorage.getItem('bikewear_lifetime_settings')!);
    expect(stored[WearPartCategory.Reifen]).toBe(9999);
  });

  it('getSettings() returns previously saved settings from localStorage', () => {
    const customSettings = { ...defaultLifetimeSettings, [WearPartCategory.Kette]: 5000 };
    service.saveSettings(customSettings);

    const result = service.getSettings();

    expect(result[WearPartCategory.Kette]).toBe(5000);
  });

  it('getSettings() falls back to defaults when localStorage contains invalid JSON', () => {
    localStorage.setItem('bikewear_lifetime_settings', 'not-valid-json');

    const result = service.getSettings();

    expect(result[WearPartCategory.Reifen]).toBe(defaultLifetimeSettings[WearPartCategory.Reifen]);
  });

  it('getSettings() merges saved values with defaults for missing keys', () => {
    // Store only Reifen override — other keys are missing
    localStorage.setItem('bikewear_lifetime_settings', JSON.stringify({ [WearPartCategory.Reifen]: 7777 }));

    const result = service.getSettings();

    expect(result[WearPartCategory.Reifen]).toBe(7777);
    expect(result[WearPartCategory.Kette]).toBe(defaultLifetimeSettings[WearPartCategory.Kette]);
  });

  it('getLifetime() returns the correct value for a given category', () => {
    const customSettings = { ...defaultLifetimeSettings, [WearPartCategory.Kassette]: 20000 };
    service.saveSettings(customSettings);

    expect(service.getLifetime(WearPartCategory.Kassette)).toBe(20000);
  });

  it('getLifetime() returns default Sonstiges value for unknown category', () => {
    const result = service.getLifetime('unknown' as WearPartCategory);

    expect(result).toBe(defaultLifetimeSettings[WearPartCategory.Sonstiges]);
  });
});
