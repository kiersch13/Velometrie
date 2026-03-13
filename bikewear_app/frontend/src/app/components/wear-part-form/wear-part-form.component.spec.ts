import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

import { WearPartFormComponent } from './wear-part-form.component';
import { WearPartService } from '../../services/wear-part.service';
import { BikeService } from '../../services/bike.service';
import { TeilVorlageService } from '../../services/teil-vorlage.service';
import { BikeCategory } from '../../models/bike-category';
import { WearPartCategory } from '../../models/wear-part-category';

describe('WearPartFormComponent – Reifen-Konvertierung', () => {
  let component: WearPartFormComponent;
  let fixture: ComponentFixture<WearPartFormComponent>;

  beforeEach(async () => {
    const wearPartServiceMock = { addWearPart: jest.fn(), updateWearPart: jest.fn() };
    const bikeServiceMock = { getOdometerAt: jest.fn().mockReturnValue(of(0)) };
    const teilVorlageServiceMock = { getAll: jest.fn().mockReturnValue(of([])) };

    await TestBed.configureTestingModule({
      declarations: [WearPartFormComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: WearPartService, useValue: wearPartServiceMock },
        { provide: BikeService, useValue: bikeServiceMock },
        { provide: TeilVorlageService, useValue: teilVorlageServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WearPartFormComponent);
    component = fixture.componentInstance;
    component.radId = 1;
    component.currentKilometerstand = 0;
    fixture.detectChanges(); // triggers ngOnInit → initialises component.part
  });

  // ── verfuegbareGroessen ────────────────────────────────────────────────────

  describe('verfuegbareGroessen', () => {
    it('returns a non-empty array of numbers', () => {
      const sizes = component.verfuegbareGroessen;
      expect(sizes.length).toBeGreaterThan(0);
      sizes.forEach(s => expect(typeof s).toBe('number'));
    });

    it('includes common road tire widths (25 and 28 mm)', () => {
      expect(component.verfuegbareGroessen).toContain(25);
      expect(component.verfuegbareGroessen).toContain(28);
    });

    it('includes MTB tire widths (≥ 50 mm)', () => {
      expect(component.verfuegbareGroessen.some(s => s >= 50)).toBe(true);
    });

    it('returns values in ascending order', () => {
      const sizes = component.verfuegbareGroessen;
      for (let i = 1; i < sizes.length; i++) {
        expect(sizes[i]).toBeGreaterThan(sizes[i - 1]);
      }
    });
  });

  // ── onReifenBreiteMmChange ─────────────────────────────────────────────────

  describe('onReifenBreiteMmChange', () => {
    it('converts 25.4 mm exactly to 1.0 Zoll', () => {
      component.part.reifenBreiteMm = 25.4;
      component.onReifenBreiteMmChange();
      expect(component.part.reifenBreiteZoll).toBe(1.0);
    });

    it('converts 28 mm and rounds to 1 decimal place (1.1 Zoll)', () => {
      component.part.reifenBreiteMm = 28;
      component.onReifenBreiteMmChange();
      expect(component.part.reifenBreiteZoll).toBe(1.1);
    });

    it('converts 50 mm to 2.0 Zoll', () => {
      component.part.reifenBreiteMm = 50;
      component.onReifenBreiteMmChange();
      // 50 / 25.4 = 1.9685... → rounds to 2.0
      expect(component.part.reifenBreiteZoll).toBe(2.0);
    });

    it('sets reifenBreiteZoll to null when mm is null', () => {
      component.part.reifenBreiteMm = null;
      component.onReifenBreiteMmChange();
      expect(component.part.reifenBreiteZoll).toBeNull();
    });

    it('sets reifenBreiteZoll to null when mm is undefined', () => {
      component.part.reifenBreiteMm = undefined;
      component.onReifenBreiteMmChange();
      expect(component.part.reifenBreiteZoll).toBeNull();
    });
  });

  // ── onReifenBreiteZollChange ───────────────────────────────────────────────

  describe('onReifenBreiteZollChange', () => {
    it('converts 1.0 Zoll to 25 mm', () => {
      component.part.reifenBreiteZoll = 1.0;
      component.onReifenBreiteZollChange();
      expect(component.part.reifenBreiteMm).toBe(25);
    });

    it('converts 2.0 Zoll to 51 mm (rounded)', () => {
      component.part.reifenBreiteZoll = 2.0;
      component.onReifenBreiteZollChange();
      // 2.0 * 25.4 = 50.8 → Math.round = 51
      expect(component.part.reifenBreiteMm).toBe(51);
    });

    it('converts 1.5 Zoll to 38 mm (rounded)', () => {
      component.part.reifenBreiteZoll = 1.5;
      component.onReifenBreiteZollChange();
      // 1.5 * 25.4 = 38.1 → Math.round = 38
      expect(component.part.reifenBreiteMm).toBe(38);
    });

    it('sets reifenBreiteMm to null when Zoll is null', () => {
      component.part.reifenBreiteZoll = null;
      component.onReifenBreiteZollChange();
      expect(component.part.reifenBreiteMm).toBeNull();
    });

    it('sets reifenBreiteMm to null when Zoll is undefined', () => {
      component.part.reifenBreiteZoll = undefined;
      component.onReifenBreiteZollChange();
      expect(component.part.reifenBreiteMm).toBeNull();
    });
  });

  // ── onReifenDruckBarChange ─────────────────────────────────────────────────

  describe('onReifenDruckBarChange', () => {
    it('converts 1.0 bar to 15 PSI (rounded)', () => {
      component.part.reifenDruckBar = 1.0;
      component.onReifenDruckBarChange();
      // 1.0 * 14.5038 = 14.5038 → Math.round = 15
      expect(component.part.reifenDruckPsi).toBe(15);
    });

    it('converts 5.0 bar to 73 PSI (rounded)', () => {
      component.part.reifenDruckBar = 5.0;
      component.onReifenDruckBarChange();
      // 5.0 * 14.5038 = 72.519 → Math.round = 73
      expect(component.part.reifenDruckPsi).toBe(73);
    });

    it('converts 2.5 bar to 36 PSI (rounded)', () => {
      component.part.reifenDruckBar = 2.5;
      component.onReifenDruckBarChange();
      // 2.5 * 14.5038 = 36.2595 → Math.round = 36
      expect(component.part.reifenDruckPsi).toBe(36);
    });

    it('sets reifenDruckPsi to null when bar is null', () => {
      component.part.reifenDruckBar = null;
      component.onReifenDruckBarChange();
      expect(component.part.reifenDruckPsi).toBeNull();
    });

    it('sets reifenDruckPsi to null when bar is undefined', () => {
      component.part.reifenDruckBar = undefined;
      component.onReifenDruckBarChange();
      expect(component.part.reifenDruckPsi).toBeNull();
    });
  });

  // ── onReifenDruckPsiChange ─────────────────────────────────────────────────

  describe('onReifenDruckPsiChange', () => {
    it('converts 100 PSI to 6.9 bar (1 decimal place)', () => {
      component.part.reifenDruckPsi = 100;
      component.onReifenDruckPsiChange();
      // 100 / 14.5038 = 6.8948... → *10 = 68.948 → round = 69 → /10 = 6.9
      expect(component.part.reifenDruckBar).toBe(6.9);
    });

    it('converts 70 PSI to 4.8 bar (1 decimal place)', () => {
      component.part.reifenDruckPsi = 70;
      component.onReifenDruckPsiChange();
      // 70 / 14.5038 = 4.8263... → *10 = 48.263 → round = 48 → /10 = 4.8
      expect(component.part.reifenDruckBar).toBe(4.8);
    });

    it('converts 15 PSI to 1.0 bar (rounded)', () => {
      component.part.reifenDruckPsi = 15;
      component.onReifenDruckPsiChange();
      // 15 / 14.5038 = 1.0342... → *10 = 10.342 → round = 10 → /10 = 1.0
      expect(component.part.reifenDruckBar).toBe(1.0);
    });

    it('sets reifenDruckBar to null when PSI is null', () => {
      component.part.reifenDruckPsi = null;
      component.onReifenDruckPsiChange();
      expect(component.part.reifenDruckBar).toBeNull();
    });

    it('sets reifenDruckBar to null when PSI is undefined', () => {
      component.part.reifenDruckPsi = undefined;
      component.onReifenDruckPsiChange();
      expect(component.part.reifenDruckBar).toBeNull();
    });
  });

  // ── round-trip consistency ─────────────────────────────────────────────────

  describe('round-trip conversions', () => {
    it('mm → Zoll → mm stays within ±1 mm for 28 mm', () => {
      component.part.reifenBreiteMm = 28;
      component.onReifenBreiteMmChange();
      component.onReifenBreiteZollChange();
      expect(component.part.reifenBreiteMm).toBeCloseTo(28, 0);
    });

    it('bar → PSI → bar stays within ±0.2 bar for 5.0 bar', () => {
      component.part.reifenDruckBar = 5.0;
      component.onReifenDruckBarChange();
      component.onReifenDruckPsiChange();
      expect(component.part.reifenDruckBar).toBeCloseTo(5.0, 0);
    });
  });

  // ── ausbauDatumStr – Kilometerstand-Neuberechnung ──────────────────────────

  describe('ausbauDatumStr setter', () => {
    let bikeService: any;

    beforeEach(() => {
      bikeService = TestBed.inject(BikeService);
    });

    it('calls getOdometerAt and updates ausbauKilometerstand when a date is set', () => {
      bikeService.getOdometerAt.mockReturnValue(of(1500));
      component.ausbauDatumStr = '2024-06-01';
      expect(bikeService.getOdometerAt).toHaveBeenCalledWith(1, '2024-06-01');
      expect(component.part.ausbauKilometerstand).toBe(1500);
    });

    it('sets ausbauDatum to the given date', () => {
      bikeService.getOdometerAt.mockReturnValue(of(0));
      component.ausbauDatumStr = '2024-06-01';
      expect(component.part.ausbauDatum).toEqual(new Date('2024-06-01'));
    });

    it('clears ausbauDatum and does not call getOdometerAt when value is empty', () => {
      bikeService.getOdometerAt.mockClear();
      component.ausbauDatumStr = '';
      expect(component.part.ausbauDatum).toBeFalsy();
      expect(bikeService.getOdometerAt).not.toHaveBeenCalled();
    });

    it('clears loadingOdometerAusbau on error', () => {
      bikeService.getOdometerAt.mockReturnValue(throwError(() => new Error('error')));
      component.ausbauDatumStr = '2024-06-01';
      expect(component.loadingOdometerAusbau).toBe(false);
    });
  });
});
