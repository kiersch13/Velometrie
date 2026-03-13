import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

import { TeilBibliothekComponent } from './teil-bibliothek.component';
import { TeilVorlageService } from '../../services/teil-vorlage.service';
import { BikeService } from '../../services/bike.service';
import { WearPartService } from '../../services/wear-part.service';
import { WearPartCategory } from '../../models/wear-part-category';

describe('TeilBibliothekComponent – Kilometerstand-Berechnung beim Hinzufügen', () => {
  let component: TeilBibliothekComponent;
  let fixture: ComponentFixture<TeilBibliothekComponent>;
  let bikeService: any;

  const mockBike = { id: 1, name: 'Testrad', kilometerstand: 5000, fahrstunden: 100 } as any;
  const mockTeil = { id: 1, name: 'GRX Chain', hersteller: 'Shimano', kategorie: WearPartCategory.Kette } as any;

  beforeEach(async () => {
    const bikeServiceMock = {
      getBikes: jest.fn().mockReturnValue(of([mockBike])),
      getOdometerAt: jest.fn().mockReturnValue(of(4500)),
    };
    const teilVorlageServiceMock = {
      getAll: jest.fn().mockReturnValue(of([])),
      getHersteller: jest.fn().mockReturnValue(of([])),
    };
    const wearPartServiceMock = {
      addWearPart: jest.fn().mockReturnValue(of({})),
    };

    await TestBed.configureTestingModule({
      declarations: [TeilBibliothekComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: BikeService, useValue: bikeServiceMock },
        { provide: TeilVorlageService, useValue: teilVorlageServiceMock },
        { provide: WearPartService, useValue: wearPartServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TeilBibliothekComponent);
    component = fixture.componentInstance;
    bikeService = TestBed.inject(BikeService);
    fixture.detectChanges();
  });

  describe('addToBikeEinbauDatumStr setter', () => {
    beforeEach(() => {
      component.openAddToBikeDialog(mockTeil);
    });

    it('calls getOdometerAt and updates einbauKilometerstand when a date is set', () => {
      bikeService.getOdometerAt.mockReturnValue(of(3000));
      component.addToBikeEinbauDatumStr = '2024-01-15';
      expect(bikeService.getOdometerAt).toHaveBeenCalledWith(mockBike.id, '2024-01-15');
      expect(component.addToBikePart.einbauKilometerstand).toBe(3000);
    });

    it('sets einbauDatum to the given date', () => {
      bikeService.getOdometerAt.mockReturnValue(of(0));
      component.addToBikeEinbauDatumStr = '2024-01-15';
      expect(component.addToBikePart.einbauDatum).toEqual(new Date('2024-01-15'));
    });

    it('clears einbauDatum and does not call getOdometerAt when value is empty', () => {
      bikeService.getOdometerAt.mockClear();
      component.addToBikeEinbauDatumStr = '';
      expect(component.addToBikePart.einbauDatum).toBeFalsy();
      expect(bikeService.getOdometerAt).not.toHaveBeenCalled();
    });

    it('falls back to bike.kilometerstand and clears loading on error', () => {
      bikeService.getOdometerAt.mockReturnValue(throwError(() => new Error('error')));
      component.addToBikeEinbauDatumStr = '2024-01-15';
      expect(component.addToBikePart.einbauKilometerstand).toBe(mockBike.kilometerstand);
      expect(component.loadingOdometerBibliothek).toBe(false);
    });

    it('clears loadingOdometerBibliothek after successful fetch', () => {
      bikeService.getOdometerAt.mockReturnValue(of(1234));
      component.addToBikeEinbauDatumStr = '2024-01-15';
      expect(component.loadingOdometerBibliothek).toBe(false);
    });
  });

  describe('onAddToBikeRadChange', () => {
    beforeEach(() => {
      component.openAddToBikeDialog(mockTeil);
      component.addToBikeEinbauDatumStr = '2024-03-01';
      bikeService.getOdometerAt.mockClear();
    });

    it('calls getOdometerAt with the bike id and current einbauDatumStr when date is set', () => {
      bikeService.getOdometerAt.mockReturnValue(of(2000));
      component.addToBikePart.radId = mockBike.id;
      component.onAddToBikeRadChange();
      expect(bikeService.getOdometerAt).toHaveBeenCalledWith(mockBike.id, '2024-03-01');
      expect(component.addToBikePart.einbauKilometerstand).toBe(2000);
    });

    it('updates einbauFahrstunden from the selected bike', () => {
      bikeService.getOdometerAt.mockReturnValue(of(0));
      component.addToBikePart.radId = mockBike.id;
      component.onAddToBikeRadChange();
      expect(component.addToBikePart.einbauFahrstunden).toBe(mockBike.fahrstunden);
    });

    it('falls back to bike.kilometerstand on API error', () => {
      bikeService.getOdometerAt.mockReturnValue(throwError(() => new Error('error')));
      component.addToBikePart.radId = mockBike.id;
      component.onAddToBikeRadChange();
      expect(component.addToBikePart.einbauKilometerstand).toBe(mockBike.kilometerstand);
      expect(component.loadingOdometerBibliothek).toBe(false);
    });

    it('uses bike.kilometerstand directly when no einbauDatumStr is set', () => {
      component.addToBikePart.einbauDatum = undefined as any;
      bikeService.getOdometerAt.mockClear();
      component.addToBikePart.radId = mockBike.id;
      component.onAddToBikeRadChange();
      expect(bikeService.getOdometerAt).not.toHaveBeenCalled();
      expect(component.addToBikePart.einbauKilometerstand).toBe(mockBike.kilometerstand);
    });
  });
});
