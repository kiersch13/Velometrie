import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TeilVorlage } from '../models/teil-vorlage';
import { WearPartCategory } from '../models/wear-part-category';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeilVorlageService {

  private apiUrl = `${environment.apiBaseUrl}/api/teilvorlage`;

  constructor(private http: HttpClient) {}

  getAll(filters?: {
    kategorie?: WearPartCategory;
    hersteller?: string;
    fahrradKategorie?: string;
  }): Observable<TeilVorlage[]> {
    let params = new HttpParams();
    if (filters?.kategorie)      params = params.set('kategorie', filters.kategorie);
    if (filters?.hersteller)     params = params.set('hersteller', filters.hersteller);
    if (filters?.fahrradKategorie) params = params.set('fahrradKategorie', filters.fahrradKategorie);
    return this.http.get<TeilVorlage[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<TeilVorlage> {
    return this.http.get<TeilVorlage>(`${this.apiUrl}/${id}`);
  }

  getHersteller(filters?: {
    kategorie?: WearPartCategory;
    fahrradKategorie?: string;
  }): Observable<string[]> {
    let params = new HttpParams();
    if (filters?.kategorie)        params = params.set('kategorie', filters.kategorie);
    if (filters?.fahrradKategorie) params = params.set('fahrradKategorie', filters.fahrradKategorie);
    return this.http.get<string[]>(`${this.apiUrl}/hersteller`, { params });
  }

  add(teil: TeilVorlage): Observable<TeilVorlage> {
    return this.http.post<TeilVorlage>(this.apiUrl, teil);
  }

  update(id: number, teil: TeilVorlage): Observable<TeilVorlage> {
    return this.http.put<TeilVorlage>(`${this.apiUrl}/${id}`, teil);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
