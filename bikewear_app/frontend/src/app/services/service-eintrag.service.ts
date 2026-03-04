import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceEintrag } from '../models/service-eintrag';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceEintragService {

  private apiUrl = `${environment.apiBaseUrl}/api/serviceeintrag`;

  constructor(private http: HttpClient) {}

  getByWearPart(wearPartId: number): Observable<ServiceEintrag[]> {
    return this.http.get<ServiceEintrag[]>(`${this.apiUrl}/wearpart/${wearPartId}`);
  }

  getById(id: number): Observable<ServiceEintrag> {
    return this.http.get<ServiceEintrag>(`${this.apiUrl}/${id}`);
  }

  add(eintrag: ServiceEintrag): Observable<ServiceEintrag> {
    return this.http.post<ServiceEintrag>(this.apiUrl, eintrag);
  }

  update(id: number, eintrag: ServiceEintrag): Observable<ServiceEintrag> {
    return this.http.put<ServiceEintrag>(`${this.apiUrl}/${id}`, eintrag);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
