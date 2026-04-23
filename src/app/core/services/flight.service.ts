import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Flight, SearchParams } from '../models/flight.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FlightService {
  private _http = inject(HttpClient);
  private _base = `${environment.apiUrl}/flights`;

  search(params: SearchParams): Observable<Flight[]> {
    const httpParams = new HttpParams()
      .set('origin', params.origin)
      .set('destination', params.destination)
      .set('date', params.date)
      .set('passengers', params.passengers.toString());
    return this._http.get<Flight[]>(this._base, { params: httpParams });
  }

  getById(id: string): Observable<Flight> {
    return this._http.get<Flight>(`${this._base}/${id}`);
  }

  getAirports(): Observable<{ code: string; city: string }[]> {
    return this._http.get<{ code: string; city: string }[]>(`${environment.apiUrl}/airports`);
  }
}
