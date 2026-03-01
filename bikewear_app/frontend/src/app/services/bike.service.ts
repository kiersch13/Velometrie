import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bike } from '../models/bike';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BikeService {

  private apiUrl = `${environment.apiBaseUrl}/api/bike`;

  constructor(private http: HttpClient) { }

  getBikes(): Observable<Bike[]> {
    return this.http.get<Bike[]>(this.apiUrl);
  }

  getBike(id: number): Observable<Bike> {
    return this.http.get<Bike>(`${this.apiUrl}/${id}`);
  }

  addBike(bike: Bike): Observable<Bike> {
    return this.http.post<Bike>(this.apiUrl, bike);
  }

  updateKilometerstand(id: number, kilometerstand: number): Observable<Bike> {
    return this.http.put<Bike>(`${this.apiUrl}/${id}/kilometerstand`, kilometerstand);
  }

  updateBike(id: number, bike: Bike): Observable<Bike> {
    return this.http.put<Bike>(`${this.apiUrl}/${id}`, bike);
  }

  deleteBike(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}