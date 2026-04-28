import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { UpperCasePipe } from '@angular/common';

import { PassengerProfile } from '../../core/models/passenger.model';
import { PassengerBookFacade } from './services/passenger-book.facade';

@Component({
  selector: 'app-passenger-book',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDividerModule,
    UpperCasePipe,
  ],
  providers: [PassengerBookFacade],
  templateUrl: './passenger-book.component.html',
  styleUrl: './passenger-book.component.scss',
})
export class PassengerBookComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  readonly facade = inject(PassengerBookFacade);

  // ── FORMULARIOS ───────────────────────────────────────────────────────────────

  readonly searchForm = this.fb.group({
    term: [''],
  });

  readonly passengerForm = this.fb.group({
    firstName:      ['', Validators.required],
    lastName:       ['', Validators.required],
    email:          ['', [Validators.required, Validators.email]],
    phone:          [''],
    documentType:   ['dni' as 'dni' | 'passport' | 'nie'],
    documentNumber: ['', Validators.required],
    nationality:    [''],
    frequentFlyer:  [false],
  });

  // ── SUBSCRIPTIONS ─────────────────────────────────────────────────────────────
  // Hay que guardarlas para cancelarlas en ngOnDestroy.
  // Si olvidamos alguna → memory leak.

  private searchSub!: Subscription;

  // ── PROPIEDADES DERIVADAS (getters) ───────────────────────────────────────────
  // Estas propiedades se recalculan en cada ciclo de change detection,
  // aunque el estado no haya cambiado.

  get canSave(): boolean {
    return (
      this.passengerForm.valid &&
      this.passengerForm.dirty &&
      !this.facade.isSaving &&
      (this.facade.selectedPassenger !== null || this.facade.isCreating)
    );
  }

  get selectedFullName(): string {
    const p = this.facade.selectedPassenger;
    return p ? `${p.firstName} ${p.lastName}` : '';
  }

  get hasUnsavedChanges(): boolean {
    return this.passengerForm.dirty &&
      (this.facade.selectedPassenger !== null || this.facade.isCreating);
  }

  // ── CICLO DE VIDA ─────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.facade.loadAll();

    // Suscripción al buscador: debounce de 300ms para no filtrar en cada tecla.
    // Necesita guardarse y cancelarse en ngOnDestroy.
    this.searchSub = this.searchForm.controls.term.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe((term) => {
      this.facade.applyFilter(term ?? '');
    });
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  // ── MÉTODOS ───────────────────────────────────────────────────────────────────

  startNew(): void {
    this.facade.startNew();
    this.passengerForm.reset({
      documentType: 'dni',
      frequentFlyer: false,
    });
    this.passengerForm.markAsDirty();
  }

  selectPassenger(passenger: PassengerProfile): void {
    this.facade.select(passenger);

    // Sincronizar el formulario con los datos del pasajero seleccionado.
    this.passengerForm.patchValue({
      firstName:      passenger.firstName,
      lastName:       passenger.lastName,
      email:          passenger.email,
      phone:          passenger.phone,
      documentType:   passenger.documentType,
      documentNumber: passenger.documentNumber,
      nationality:    passenger.nationality,
      frequentFlyer:  passenger.frequentFlyer,
    });

    // Marcar como pristine para que canSave y hasUnsavedChanges sean false
    // justo después de seleccionar (todavía no hay cambios del usuario).
    this.passengerForm.markAsPristine();
  }

  save(): void {
    if (!this.canSave) return;

    this.facade.save(this.passengerForm.value as Partial<PassengerProfile>);

    // Una vez guardado, marcar el formulario como pristine.
    // Problema: esto se ejecuta antes de que la respuesta HTTP llegue,
    // porque save() es void y no devuelve Observable.
    // Si el guardado falla, el formulario ya está como pristine.
    this.passengerForm.markAsPristine();
  }
}