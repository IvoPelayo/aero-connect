import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookingRequest, BookingConfirmation } from '../models/booking.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private _http = inject(HttpClient);
  private _base = `${environment.apiUrl}/bookings`;

  create(booking: BookingRequest): Observable<BookingConfirmation> {
    return this._http.post<BookingConfirmation>(this._base, booking);
  }
}
