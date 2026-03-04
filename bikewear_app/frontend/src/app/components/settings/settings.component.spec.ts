import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SettingsComponent } from './settings.component';
import { LifetimeSettingsService } from '../../services/lifetime-settings.service';
import { AuthService } from '../../services/auth.service';
import { defaultLifetimeSettings } from '../../models/lifetime-settings';
import { BikeCategory } from '../../models/bike-category';
import { WearPartCategory } from '../../models/wear-part-category';

describe('SettingsComponent – resetLifetimeSettings', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let lifetimeServiceMock: jest.Mocked<Pick<LifetimeSettingsService, 'getSettings' | 'saveSettings'>>;
  let savedSettings: any;

  beforeEach(async () => {
    // Capture what saveSettings is called with
    savedSettings = null;
    lifetimeServiceMock = {
      getSettings: jest.fn().mockReturnValue(JSON.parse(JSON.stringify(defaultLifetimeSettings))),
      saveSettings: jest.fn().mockImplementation((s: any) => { savedSettings = JSON.parse(JSON.stringify(s)); }),
    };

    const authServiceMock = { currentUser: null, isLoggedIn: false, isStravaConnected: false };
    const routerMock = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      imports: [FormsModule],
      providers: [
        { provide: LifetimeSettingsService, useValue: lifetimeServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('resetLifetimeSettings() saves the true defaults even after form input modified the settings object', () => {
    // Step 1: User resets → shallow copy issue would expose defaultLifetimeSettings.km
    component.resetLifetimeSettings();
    const afterFirstReset = savedSettings;

    // Step 2: Simulate the user modifying a value in the form after reset
    // (This used to mutate defaultLifetimeSettings due to shallow copy)
    component.lifetimeSettings.km[BikeCategory.Rennrad][WearPartCategory.Reifen] = 9999;

    // Step 3: User resets again → should save TRUE defaults, not 9999
    component.resetLifetimeSettings();
    const afterSecondReset = savedSettings;

    // Both resets should save the same true default value
    expect(afterFirstReset.km[BikeCategory.Rennrad][WearPartCategory.Reifen])
      .toBe(defaultLifetimeSettings.km[BikeCategory.Rennrad][WearPartCategory.Reifen]);
    expect(afterSecondReset.km[BikeCategory.Rennrad][WearPartCategory.Reifen])
      .toBe(defaultLifetimeSettings.km[BikeCategory.Rennrad][WearPartCategory.Reifen]);
  });

  it('resetLifetimeSettings() does not mutate defaultLifetimeSettings', () => {
    const originalReifenValue = defaultLifetimeSettings.km[BikeCategory.Rennrad][WearPartCategory.Reifen];

    component.resetLifetimeSettings();

    // Simulate modifying the form input after reset
    component.lifetimeSettings.km[BikeCategory.Rennrad][WearPartCategory.Reifen] = 9999;

    // defaultLifetimeSettings must remain unchanged
    expect(defaultLifetimeSettings.km[BikeCategory.Rennrad][WearPartCategory.Reifen])
      .toBe(originalReifenValue);
  });
});
