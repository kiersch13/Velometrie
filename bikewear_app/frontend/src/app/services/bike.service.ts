import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bike } from '../models/bike';

@Injectable({
  providedIn: 'root'
})
export class BikeService {

  private apiUrl = 'http://localhost:5059/api/bike';

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
}