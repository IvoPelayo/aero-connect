import { Injectable, computed, inject, signal } from '@angular/core';
import { FlightService } from '../../../core/services/flight.service';
import { Flight, SearchParams } from '../../../core/models/flight.model';
import { catchError, filter, finalize, of, switchMap, tap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Injectable()
export class FlightSearchService {
  private _flightService = inject(FlightService);

  private _searchParams = signal<SearchParams | null>(null);
  private _maxPrice = signal<number | null>(null);
  private _sortBy = signal<'price' | 'departure' | 'duration'>('price');

  private _flights = toSignal<Flight[] | undefined>(toObservable(this._searchParams).pipe(
    tap(() => this._isLoading.set(true)),
    filter(searchParams => !!searchParams),
    switchMap(searchParams => this._flightService.search(searchParams!).pipe(
      finalize(() => this._isLoading.set(false))
    )),
    catchError(() => {
      this._error.set('No se han podido cargar los vuelos. Inténtalo de nuevo.');
      return of([]);
    }),
  ));

  private _isLoading = signal(false);
  private _error =  signal<string | null>(null);

  searchParams = this._searchParams.asReadonly();
  maxPrice = this._maxPrice.asReadonly();
  sortBy = this._sortBy.asReadonly();
  isLoading = this._isLoading.asReadonly();
  error = this._error.asReadonly();

  filteredFlights = computed(() => {
    let result = [...this._flights() || []];
    if (this._maxPrice()) {
      result = result.filter(f => f.basePrice <= this._maxPrice()!);
    }
    result = result.sort((a, b) => {
      if (this._sortBy() === 'price') return a.basePrice - b.basePrice;
      if (this._sortBy() === 'departure') return a.departureDate.localeCompare(b.departureDate);
      return a.durationMinutes - b.durationMinutes;
    });
    return result;
  });

  setParams(params: SearchParams): void {
    this._searchParams.set(params);
  }

  setMaxPrice(price: number | null): void {
    this._maxPrice.set(price);
  }
  
  setSort(sort: 'price' | 'departure' | 'duration'): void {
    this._sortBy.set(sort);
  }
}
