import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WearPartGruppe } from '../models/wear-part-gruppe';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WearPartGruppeService {

  private apiUrl = `${environment.apiBaseUrl}/api/wearpartgruppe`;

  constructor(private http: HttpClient) { }

  getByBike(radId: number): Observable<WearPartGruppe[]> {
    return this.http.get<WearPartGruppe[]>(`${this.apiUrl}/bike/${radId}`);
  }

  getById(id: number): Observable<WearPartGruppe> {
    return this.http.get<WearPartGruppe>(`${this.apiUrl}/${id}`);
  }

  add(gruppe: WearPartGruppe): Observable<WearPartGruppe> {
    return this.http.post<WearPartGruppe>(this.apiUrl, gruppe);
  }

  update(id: number, gruppe: WearPartGruppe): Observable<WearPartGruppe> {
    return this.http.put<WearPartGruppe>(`${this.apiUrl}/${id}`, gruppe);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
