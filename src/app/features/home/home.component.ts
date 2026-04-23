import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private _router = inject(Router);

  origin = '';
  destination = '';
  date = '';
  passengers = 1;

  readonly airports = [
    { code: 'BCN', city: 'Barcelona' },
    { code: 'MAD', city: 'Madrid' },
    { code: 'VLC', city: 'Valencia' },
    { code: 'SVQ', city: 'Sevilla' },
    { code: 'PMI', city: 'Palma de Mallorca' },
    { code: 'LPA', city: 'Las Palmas' },
  ];

  search(): void {
    if (!this.origin || !this.destination || !this.date) return;
    this._router.navigate(['/flights'], {
      queryParams: {
        origin: this.origin,
        destination: this.destination,
        date: this.date,
        passengers: this.passengers,
      },
    });
  }
}
