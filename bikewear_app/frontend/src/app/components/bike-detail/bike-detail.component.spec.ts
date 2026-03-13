import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

import { BikeDetailComponent } from './bike-detail.component';
import { BikeService } from '../../services/bike.service';
import { WearPartService } from '../../services/wear-part.service';
import { WearPartGruppeService } from '../../services/wear-part-gruppe.service';
import { ServiceEintragService } from '../../services/service-eintrag.service';
import { LifetimeSettingsService } from '../../services/lifetime-settings.service';
import { BikeCategory } from '../../models/bike-category';
import { WearPartCategory } from '../../models/wear-part-category';
import { WearPart } from '../../models/wear-part';

// Minimal WearPart factory shared between tests
function makePart(overrides: Partial<WearPart> = {}): WearPart {
  return {
    id: 1,
    radId: 1,
    name: 'Testreifen',
    kategorie: WearPartCategory.Reifen,
    position: 'Vorderrad',
    einbauKilometerstand: 0,
    ausbauKilometerstand: null,
    einbauDatum: new Date('2025-01-01'),
    ausbauDatum: null,
    einbauFahrstunden: null,
    ausbauFahrstunden: null,
    notizen: null,
    vorgaengerId: null,
    gruppeId: null,
    indoorIgnorieren: false,
    einbauIndoorKilometerstand: 0,
    ausbauIndoorKilometerstand: null,
    ...overrides,
  };
}

describe('BikeDetailComponent – Reifen-Edit & getPartConfigSummary', () => {
  let component: BikeDetailComponent;
  let fixture: ComponentFixture<BikeDetailComponent>;

  beforeEach(async () => {
    const activatedRouteMock = {
      snapshot: { paramMap: { get: jest.fn().mockReturnValue('1') } },
    };
    const routerMock = { navigate: jest.fn() };
    const bikeServiceMock = {
      getBike: jest.fn().mockReturnValue(of({
        id: 1, name: 'Testauto', kategorie: BikeCategory.Rennrad, kilometerstand: 500, fahrstunden: 0, stravaId: null, userId: 1,
        indoorKilometerstand: 0, sattelhoehe: null, sattelversatz: null, vorbaulaenge: null, vorbauwinkel: null,
        kurbellaenge: null, lenkerbreite: null, spacer: null, reach: null, stack: null, radstand: null,
      })),
      getWeeklyAvgKm: jest.fn().mockReturnValue(of(50)),
      updateBike: jest.fn(),
      deleteBike: jest.fn(),
    };
    const wearPartServiceMock = {
      getWearPartsByBike: jest.fn().mockReturnValue(of([])),
      updateWearPart: jest.fn(),
      deleteWearPart: jest.fn(),
    };
    const lifetimeServiceMock = {
      getLifetime: jest.fn().mockReturnValue(10000),
      getFederungServiceSettings: jest.fn().mockReturnValue({ kleinerService: 50, grosserService: 200 }),
    };
    const serviceEintragServiceMock = {
      getByWearPart: jest.fn().mockReturnValue(of([])),
      add: jest.fn(),
      delete: jest.fn(),
    };
    const wearPartGruppeServiceMock = {
      getByBike: jest.fn().mockReturnValue(of([])),
      add: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [BikeDetailComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Router, useValue: routerMock },
        { provide: BikeService, useValue: bikeServiceMock },
        { provide: WearPartService, useValue: wearPartServiceMock },
        { provide: WearPartGruppeService, useValue: wearPartGruppeServiceMock },
        { provide: ServiceEintragService, useValue: serviceEintragServiceMock },
        { provide: LifetimeSettingsService, useValue: lifetimeServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BikeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit
  });

  // Helper: place a copy of a part into editingWearPart
  function setEditing(overrides: Partial<WearPart> = {}): void {
    component.editingWearPart = makePart(overrides);
  }

  // ── onEditReifenBreiteMmChange ─────────────────────────────────────────────

  describe('onEditReifenBreiteMmChange', () => {
    it('converts 25.4 mm to 1.0 Zoll', () => {
      setEditing({ reifenBreiteMm: 25.4 });
      component.onEditReifenBreiteMmChange();
      expect(component.editingWearPart!.reifenBreiteZoll).toBe(1.0);
    });

    it('converts 28 mm to 1.1 Zoll (rounded to 1 decimal)', () => {
      setEditing({ reifenBreiteMm: 28 });
      component.onEditReifenBreiteMmChange();
      expect(component.editingWearPart!.reifenBreiteZoll).toBe(1.1);
    });

    it('sets reifenBreiteZoll to null when mm is null', () => {
      setEditing({ reifenBreiteMm: null });
      component.onEditReifenBreiteMmChange();
      expect(component.editingWearPart!.reifenBreiteZoll).toBeNull();
    });

    it('does nothing when editingWearPart is null', () => {
      component.editingWearPart = null;
      expect(() => component.onEditReifenBreiteMmChange()).not.toThrow();
    });
  });

  // ── onEditReifenBreiteZollChange ───────────────────────────────────────────

  describe('onEditReifenBreiteZollChange', () => {
    it('converts 1.0 Zoll to 25 mm', () => {
      setEditing({ reifenBreiteZoll: 1.0 });
      component.onEditReifenBreiteZollChange();
      expect(component.editingWearPart!.reifenBreiteMm).toBe(25);
    });

    it('converts 2.0 Zoll to 51 mm (rounded)', () => {
      setEditing({ reifenBreiteZoll: 2.0 });
      component.onEditReifenBreiteZollChange();
      // 2.0 * 25.4 = 50.8 → Math.round = 51
      expect(component.editingWearPart!.reifenBreiteMm).toBe(51);
    });

    it('sets reifenBreiteMm to null when Zoll is null', () => {
      setEditing({ reifenBreiteZoll: null });
      component.onEditReifenBreiteZollChange();
      expect(component.editingWearPart!.reifenBreiteMm).toBeNull();
    });

    it('does nothing when editingWearPart is null', () => {
      component.editingWearPart = null;
      expect(() => component.onEditReifenBreiteZollChange()).not.toThrow();
    });
  });

  // ── onEditReifenDruckBarChange ─────────────────────────────────────────────

  describe('onEditReifenDruckBarChange', () => {
    it('converts 5.0 bar to 73 PSI (rounded)', () => {
      setEditing({ reifenDruckBar: 5.0 });
      component.onEditReifenDruckBarChange();
      // 5.0 * 14.5038 = 72.519 → Math.round = 73
      expect(component.editingWearPart!.reifenDruckPsi).toBe(73);
    });

    it('converts 2.5 bar to 36 PSI (rounded)', () => {
      setEditing({ reifenDruckBar: 2.5 });
      component.onEditReifenDruckBarChange();
      // 2.5 * 14.5038 = 36.2595 → Math.round = 36
      expect(component.editingWearPart!.reifenDruckPsi).toBe(36);
    });

    it('sets reifenDruckPsi to null when bar is null', () => {
      setEditing({ reifenDruckBar: null });
      component.onEditReifenDruckBarChange();
      expect(component.editingWearPart!.reifenDruckPsi).toBeNull();
    });

    it('does nothing when editingWearPart is null', () => {
      component.editingWearPart = null;
      expect(() => component.onEditReifenDruckBarChange()).not.toThrow();
    });
  });

  // ── onEditReifenDruckPsiChange ─────────────────────────────────────────────

  describe('onEditReifenDruckPsiChange', () => {
    it('converts 100 PSI to 6.9 bar (1 decimal place)', () => {
      setEditing({ reifenDruckPsi: 100 });
      component.onEditReifenDruckPsiChange();
      // 100 / 14.5038 = 6.8948... → *10 = 68.948 → round = 69 → /10 = 6.9
      expect(component.editingWearPart!.reifenDruckBar).toBe(6.9);
    });

    it('converts 70 PSI to 4.8 bar (1 decimal place)', () => {
      setEditing({ reifenDruckPsi: 70 });
      component.onEditReifenDruckPsiChange();
      // 70 / 14.5038 = 4.8263... → *10 = 48.263 → round = 48 → /10 = 4.8
      expect(component.editingWearPart!.reifenDruckBar).toBe(4.8);
    });

    it('sets reifenDruckBar to null when PSI is null', () => {
      setEditing({ reifenDruckPsi: null });
      component.onEditReifenDruckPsiChange();
      expect(component.editingWearPart!.reifenDruckBar).toBeNull();
    });

    it('does nothing when editingWearPart is null', () => {
      component.editingWearPart = null;
      expect(() => component.onEditReifenDruckPsiChange()).not.toThrow();
    });
  });

  // ── getPartConfigSummary ──────────────────────────────────────────────────

  describe('getPartConfigSummary', () => {
    it('returns "–" when no tire metrics are set', () => {
      const part = makePart({ reifenBreiteMm: null, reifenDruckBar: null });
      expect(component.getPartConfigSummary(part)).toBe('–');
    });

    it('returns "–" when tire metric fields are absent', () => {
      const part = makePart();
      expect(component.getPartConfigSummary(part)).toBe('–');
    });

    it('includes only reifenBreiteMm when druck is absent', () => {
      const part = makePart({ reifenBreiteMm: 28, reifenDruckBar: null });
      expect(component.getPartConfigSummary(part)).toBe('28 mm');
    });

    it('includes only reifenDruckBar when Breite is absent', () => {
      const part = makePart({ reifenBreiteMm: null, reifenDruckBar: 3.5 });
      expect(component.getPartConfigSummary(part)).toBe('3.5 bar');
    });

    it('combines both values with " · " separator', () => {
      const part = makePart({ reifenBreiteMm: 28, reifenDruckBar: 5 });
      expect(component.getPartConfigSummary(part)).toBe('28 mm · 5 bar');
    });

    it('lists reifenBreiteMm before reifenDruckBar', () => {
      const part = makePart({ reifenBreiteMm: 25, reifenDruckBar: 7 });
      const summary = component.getPartConfigSummary(part);
      expect(summary.indexOf('25 mm')).toBeLessThan(summary.indexOf('7 bar'));
    });
  });

  // ── round-trip consistency (edit path) ───────────────────────────────────

  describe('round-trip conversions (edit path)', () => {
    it('mm → Zoll → mm stays within ±1 mm for 38 mm', () => {
      setEditing({ reifenBreiteMm: 38 });
      component.onEditReifenBreiteMmChange();
      component.onEditReifenBreiteZollChange();
      expect(component.editingWearPart!.reifenBreiteMm).toBeCloseTo(38, 0);
    });

    it('bar → PSI → bar stays within ±0.2 bar for 3.0 bar', () => {
      setEditing({ reifenDruckBar: 3.0 });
      component.onEditReifenDruckBarChange();
      component.onEditReifenDruckPsiChange();
      expect(component.editingWearPart!.reifenDruckBar).toBeCloseTo(3.0, 0);
    });
  });
});
