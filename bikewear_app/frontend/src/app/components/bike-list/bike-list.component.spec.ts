import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { BikeListComponent } from './bike-list.component';
import { BikeService } from '../../services/bike.service';
import { BikeCategory } from '../../models/bike-category';

// ─────────────────────────────────────────────────────────────
// Why NO_ERRORS_SCHEMA?
// The template uses <lucide-icon> from lucide-angular.
// Rather than importing the full icon module in every test,
// NO_ERRORS_SCHEMA tells Angular to silently ignore unknown
// elements and attributes — perfectly fine for unit tests.
// ─────────────────────────────────────────────────────────────

describe('BikeListComponent', () => {
  let component: BikeListComponent;
  let fixture: ComponentFixture<BikeListComponent>;
  let bikeServiceMock: jest.Mocked<Pick<BikeService, 'getBikes'>>;
  let routerMock: { navigate: jest.Mock };

  const mockBikes = [
    { id: 1, name: 'Rennmaschine', kategorie: BikeCategory.Rennrad, kilometerstand: 1000, stravaId: null as any },
    { id: 2, name: 'Gravel King',  kategorie: BikeCategory.Gravel,   kilometerstand: 500,  stravaId: null as any },
  ];

  beforeEach(async () => {
    bikeServiceMock = {
      getBikes: jest.fn().mockReturnValue(of(mockBikes)),
    };
    routerMock = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      declarations: [BikeListComponent],
      providers: [
        { provide: BikeService, useValue: bikeServiceMock },
        { provide: Router, useValue: routerMock },
      ],
      // Suppress errors for unknown elements (lucide-icon, etc.)
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BikeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit → loadBikes()
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getBikes() on init', () => {
    expect(bikeServiceMock.getBikes).toHaveBeenCalledTimes(1);
  });

  it('should populate the bikes array after loading', () => {
    expect(component.bikes.length).toBe(2);
    expect(component.bikes[0].name).toBe('Rennmaschine');
  });

  it('should render bike names in the DOM', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Rennmaschine');
    expect(compiled.textContent).toContain('Gravel King');
  });

  it('should set an error message when getBikes() fails', () => {
    // Override mock to simulate a server error
    bikeServiceMock.getBikes.mockReturnValue(throwError(() => new Error('Server error')));

    component.loadBikes();
    fixture.detectChanges();

    expect(component.error).toBe('Fehler beim Laden der Räder.');
  });

  it('openDetail() navigates to the bike detail route', () => {
    component.openDetail(1);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/bikes', 1]);
  });

  it('addBike() navigates to the add bike route', () => {
    component.addBike();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/bikes/add']);
  });
});
