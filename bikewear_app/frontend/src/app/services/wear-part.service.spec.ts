import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WearPartService } from './wear-part.service';
import { WearPart } from '../models/wear-part';
import { WearPartCategory } from '../models/wear-part-category';

describe('WearPartService', () => {
  let service: WearPartService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:5059/api/wearpart';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WearPartService],
    });
    service = TestBed.inject(WearPartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  const mockPart: WearPart = {
    id: 1,
    radId: 10,
    name: 'Vorderreifen',
    kategorie: WearPartCategory.Reifen,
    position: 'Vorne',
    einbauKilometerstand: 0,
    ausbauKilometerstand: null,
    einbauDatum: new Date('2024-01-01'),
    ausbauDatum: null,
    einbauFahrstunden: 0,
    ausbauFahrstunden: null,
    notizen: null,
  };

  it('getWearParts() sends a GET request to the correct endpoint', () => {
    service.getWearParts().subscribe(parts => {
      expect(parts.length).toBe(1);
      expect(parts[0].name).toBe('Vorderreifen');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush([mockPart]);
  });

  it('getWearParts() returns empty array when no parts exist', () => {
    service.getWearParts().subscribe(parts => {
      expect(parts.length).toBe(0);
    });

    httpMock.expectOne(apiUrl).flush([]);
  });

  it('getWearPartsByBike(radId) sends a GET to the bike-scoped endpoint', () => {
    service.getWearPartsByBike(10).subscribe(parts => {
      expect(parts.length).toBe(1);
    });

    const req = httpMock.expectOne(`${apiUrl}/bike/10`);
    expect(req.request.method).toBe('GET');
    req.flush([mockPart]);
  });

  it('getWearPart(id) sends a GET request with the correct id', () => {
    service.getWearPart(1).subscribe(part => {
      expect(part.name).toBe('Vorderreifen');
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPart);
  });

  it('addWearPart() sends a POST request with the part in the body', () => {
    const newPart: WearPart = { ...mockPart, id: 0 };

    service.addWearPart(newPart).subscribe(result => {
      expect(result.id).toBe(1);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.name).toBe('Vorderreifen');
    req.flush(mockPart);
  });

  it('updateWearPart() sends a PUT request to the correct URL', () => {
    const updated: WearPart = { ...mockPart, name: 'Hinterreifen' };

    service.updateWearPart(1, updated).subscribe(result => {
      expect(result.name).toBe('Hinterreifen');
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.name).toBe('Hinterreifen');
    req.flush(updated);
  });

  it('deleteWearPart() sends a DELETE request to the correct URL', () => {
    service.deleteWearPart(1).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
