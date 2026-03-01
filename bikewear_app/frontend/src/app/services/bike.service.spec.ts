import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BikeService } from './bike.service';
import { Bike } from '../models/bike';
import { BikeCategory } from '../models/bike-category';

describe('BikeService', () => {
  let service: BikeService;
  // HttpTestingController lets us inspect and flush outgoing HTTP requests
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:5059/api/bike';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BikeService],
    });
    service = TestBed.inject(BikeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // After each test, assert that there are no unexpected HTTP requests still pending
  afterEach(() => {
    httpMock.verify();
  });

  it('getBikes() sends a GET request to the correct endpoint', () => {
    const mockBikes: Bike[] = [
      { id: 1, name: 'Rennmaschine', kategorie: BikeCategory.Rennrad, kilometerstand: 1000, stravaId: null as any },
    ];

    service.getBikes().subscribe(bikes => {
      expect(bikes.length).toBe(1);
      expect(bikes[0].name).toBe('Rennmaschine');
    });

    // Expect exactly one GET request to our API
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    // Simulate the server responding with mock data
    req.flush(mockBikes);
  });

  it('getBike(id) sends a GET request with the correct id in the URL', () => {
    const mockBike: Bike = { id: 2, name: 'Gravelbike', kategorie: BikeCategory.Gravel, kilometerstand: 500, stravaId: null as any };

    service.getBike(2).subscribe(bike => {
      expect(bike.name).toBe('Gravelbike');
    });

    const req = httpMock.expectOne(`${apiUrl}/2`);
    expect(req.request.method).toBe('GET');
    req.flush(mockBike);
  });

  it('addBike() sends a POST request with the bike in the body', () => {
    const newBike: Bike = { id: 0, name: 'Neues Rad', kategorie: BikeCategory.Mountainbike, kilometerstand: 0, stravaId: null as any };

    service.addBike(newBike).subscribe(result => {
      expect(result.id).toBe(3); // server assigns the real ID
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.name).toBe('Neues Rad');
    req.flush({ ...newBike, id: 3 });
  });

  it('updateKilometerstand() sends a PUT request to the correct URL', () => {
    service.updateKilometerstand(1, 9999).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/1/kilometerstand`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('updateBike() sends a PUT request to the correct URL with the bike body', () => {
    const bike: Bike = { id: 5, name: 'Geändertes Rad', kategorie: BikeCategory.Gravel, kilometerstand: 300, stravaId: null as any };

    service.updateBike(5, bike).subscribe(result => {
      expect(result.name).toBe('Geändertes Rad');
    });

    const req = httpMock.expectOne(`${apiUrl}/5`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.name).toBe('Geändertes Rad');
    req.flush(bike);
  });

  it('deleteBike() sends a DELETE request to the correct URL', () => {
    service.deleteBike(7).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/7`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('getOdometerAt() sends a GET request with the correct query params', () => {
    service.getOdometerAt(3, '2025-12-01', 42).subscribe(km => {
      expect(km).toBe(2549);
    });

    const req = httpMock.expectOne(`${apiUrl}/3/odometer-at?date=2025-12-01&userId=42`);
    expect(req.request.method).toBe('GET');
    req.flush(2549);
  });
});
