import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TeilVorlageService } from './teil-vorlage.service';
import { TeilVorlage } from '../models/teil-vorlage';
import { WearPartCategory } from '../models/wear-part-category';

describe('TeilVorlageService', () => {
  let service: TeilVorlageService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:5059/api/teilvorlage';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TeilVorlageService],
    });
    service = TestBed.inject(TeilVorlageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  const mockTeil: TeilVorlage = {
    id: 1,
    name: 'Shimano Ultegra 12s Kette',
    hersteller: 'Shimano',
    kategorie: WearPartCategory.Kette,
    gruppe: 'Ultegra',
    geschwindigkeiten: 12,
    fahrradKategorien: 'Rennrad,Gravel',
    beschreibung: 'Hochwertige 12-fach Kette',
  };

  it('getAll() sends a GET request to the correct endpoint with no filters', () => {
    service.getAll().subscribe(teile => {
      expect(teile.length).toBe(1);
      expect(teile[0].name).toBe('Shimano Ultegra 12s Kette');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush([mockTeil]);
  });

  it('getAll() appends kategorie query param when provided', () => {
    service.getAll({ kategorie: WearPartCategory.Kette }).subscribe();

    const req = httpMock.expectOne(`${apiUrl}?kategorie=Kette`);
    expect(req.request.method).toBe('GET');
    req.flush([mockTeil]);
  });

  it('getAll() appends hersteller query param when provided', () => {
    service.getAll({ hersteller: 'Shimano' }).subscribe();

    const req = httpMock.expectOne(`${apiUrl}?hersteller=Shimano`);
    expect(req.request.method).toBe('GET');
    req.flush([mockTeil]);
  });

  it('getAll() appends suche query param when provided', () => {
    service.getAll({ suche: 'Ultegra' }).subscribe();

    const req = httpMock.expectOne(`${apiUrl}?suche=Ultegra`);
    expect(req.request.method).toBe('GET');
    req.flush([mockTeil]);
  });

  it('getAll() returns empty array when no results', () => {
    service.getAll().subscribe(teile => {
      expect(teile.length).toBe(0);
    });

    httpMock.expectOne(apiUrl).flush([]);
  });

  it('getById(id) sends a GET request with the correct id', () => {
    service.getById(1).subscribe(teil => {
      expect(teil.name).toBe('Shimano Ultegra 12s Kette');
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTeil);
  });

  it('getHersteller() sends a GET request to the hersteller endpoint', () => {
    service.getHersteller().subscribe(list => {
      expect(list).toContain('Shimano');
    });

    const req = httpMock.expectOne(`${apiUrl}/hersteller`);
    expect(req.request.method).toBe('GET');
    req.flush(['Shimano', 'SRAM', 'Continental']);
  });

  it('getHersteller() appends kategorie filter when provided', () => {
    service.getHersteller({ kategorie: WearPartCategory.Reifen }).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/hersteller?kategorie=Reifen`);
    expect(req.request.method).toBe('GET');
    req.flush(['Continental', 'Schwalbe']);
  });

  it('add() sends a POST request with the teil in the body', () => {
    const newTeil: TeilVorlage = { ...mockTeil, id: 0 };

    service.add(newTeil).subscribe(result => {
      expect(result.id).toBe(1);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.name).toBe('Shimano Ultegra 12s Kette');
    req.flush(mockTeil);
  });

  it('update() sends a PUT request to the correct URL', () => {
    const updated: TeilVorlage = { ...mockTeil, name: 'Shimano 105 12s Kette' };

    service.update(1, updated).subscribe(result => {
      expect(result.name).toBe('Shimano 105 12s Kette');
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updated);
  });

  it('delete() sends a DELETE request to the correct URL', () => {
    service.delete(1).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('enrich() sends a POST request to the enrich endpoint', () => {
    const partial: Partial<TeilVorlage> = { name: 'Shimano Kette', hersteller: 'Shimano' };

    service.enrich(partial as TeilVorlage).subscribe(result => {
      expect(result.kategorie).toBe(WearPartCategory.Kette);
    });

    const req = httpMock.expectOne(`${apiUrl}/enrich`);
    expect(req.request.method).toBe('POST');
    req.flush(mockTeil);
  });
});
