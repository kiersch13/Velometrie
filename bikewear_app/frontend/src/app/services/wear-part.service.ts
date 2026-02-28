import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WearPart } from '../models/wear-part';

@Injectable({
  providedIn: 'root'
})
export class WearPartService {

  private apiUrl = 'http://localhost:5059/api/wearpart';

  constructor(private http: HttpClient) { }

  getWearParts(): Observable<WearPart[]> {
    return this.http.get<WearPart[]>(this.apiUrl);
  }

  getWearPartsByBike(radId: number): Observable<WearPart[]> {
    return this.http.get<WearPart[]>(`${this.apiUrl}/bike/${radId}`);
  }

  getWearPart(id: number): Observable<WearPart> {
    return this.http.get<WearPart>(`${this.apiUrl}/${id}`);
  }

  addWearPart(wearPart: WearPart): Observable<WearPart> {
    return this.http.post<WearPart>(this.apiUrl, wearPart);
  }
}