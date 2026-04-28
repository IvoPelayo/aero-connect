import { Injectable, computed, inject, signal } from '@angular/core';
import { PassengerService } from '../../../core/services/passenger.service';
import { PassengerProfile } from '../../../core/models/passenger.model';
import { catchError, finalize, Observable, of, take, tap, throttleTime, throwError } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

/**
 * Facade de PassengerBook — versión imperativa
 *
 * Responsabilidades:
 *  - Coordinar las llamadas HTTP (PassengerService)
 *  - Mantener el estado de la feature
 *  - Exponer una API limpia al componente
 *
 * Problemas de esta implementación que resolveremos con Signals:
 *  1. Estado mutable y público → cualquiera puede escribir en él
 *  2. 'filteredPassengers' es un array duplicado de 'passengers' → pueden desincronizarse
 *  3. La lógica de filtrado tiene que ejecutarse manualmente en dos sitios (loadAll + applyFilter)
 *  4. setTimeout para ocultar el banner de éxito → no es reactivo
 *  5. Ninguna propiedad derivada está memoizada
 */
@Injectable()
export class PassengerBookFacade {
  private readonly passengerService = inject(PassengerService);

  // ── ESTADO ───────────────────────────────────────────────────────────────────
  // Propiedades de clase planas: no hay notificación automática de cambios,
  // Angular los detecta sólo porque usa Zone.js y revisión de árbol completo.

  passengers = signal<PassengerProfile[]>([]);
  filters = signal<string>('');

  // Array duplicado para la vista filtrada.
  // Hay que mantenerlo sincronizado con 'passengers' manualmente.
  filteredPassengers = computed<PassengerProfile[]>(() => {
    if (!this.filters().trim()) {
      // Restaurar la lista completa cuando el filtro está vacío.
      return this.passengers();
    }
    const compare = this.filters().trim().toLowerCase();
    return this.passengers().filter(
      (p) =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(compare) ||
        p.documentNumber.toLowerCase().includes(compare) ||
        p.email.toLowerCase().includes(compare)
    );
  });

  selectedPassenger = signal<PassengerProfile | null>(null);

  // true mientras el formulario está en modo "alta" (en lugar de edición)
  isCreating = signal(false);

  isLoading = signal(false);
  isSaving = signal(false);
  error = signal<string | null>(null);
  saveSuccess = signal(false);

  private loadAllSignal = toSignal(this.passengerService.getAll().pipe(
      tap(pass => this.passengers.set(pass)),
      catchError(() => {
        this.error.set('No se pudieron cargar los pasajeros.');
        return of([]);
      }),
      finalize(() => this.isLoading.set(false))
    ));

  // ── ACCIONES ─────────────────────────────────────────────────────────────────

  loadAll(): void {
    this.error.set(null);
    this.isLoading.set(true);
    
    this.loadAllSignal(); 
  }

  select(passenger: PassengerProfile): void {
    this.selectedPassenger.set(passenger);
    this.isCreating.set(false);
    this.error.set(null);
    this.saveSuccess.set(false);
  }

  startNew(): void {
    this.selectedPassenger.set(null);
    this.isCreating.set(true);
    this.error.set(null);
    this.saveSuccess.set(false);
  }

  applyFilter(term: string): void {
    this.filters.set(term);
  }

  save(data: Partial<PassengerProfile>): void {
    this.isSaving.set(true);
    this.error.set(null);
    this.saveSuccess.set(false);

    (this.isCreating() ? 
      this._create(data) : 
      this._update(this.selectedPassenger()!.id, data)
    ).pipe(
      take(1),
      tap(passenger => {
        
        this.selectedPassenger.set(passenger);
        this.isCreating.set(false);
        this.saveSuccess.set(true);

        setTimeout(() => { this.saveSuccess.set(false); }, 3000);
      }),
      finalize(() => this.isSaving.set(false))
    ).subscribe();
  }

  private _update(id: string, data: Partial<PassengerProfile>): Observable<PassengerProfile> {
    return this.passengerService.update(id, data).pipe(
      tap(updated => {
        this.passengers.update(pass => {
          const idx = pass.findIndex((p) => p.id === id);
          if (idx !== -1) pass[idx] = updated;
          return pass;
        });
        
      }),
      catchError((error) => {
        this.error.set('No se pudo guardar. Inténtalo de nuevo.');
        return throwError(() => error);
      })
    );
  }

  private _create(data: Partial<PassengerProfile>): Observable<PassengerProfile> {
    return this.passengerService.create(data as Omit<PassengerProfile, 'id' | 'totalFlights'>).pipe(
      tap(created =>  this.passengers.update((pass) => [...pass, created])),
      catchError((error) => {
        this.error.set('No se pudo crear el pasajero. Inténtalo de nuevo.');
        return throwError(() => error);
      })
    );
  }
}
