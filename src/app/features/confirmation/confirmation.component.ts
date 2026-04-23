import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BookingConfirmation } from '../../core/models/booking.model';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, CurrencyPipe, DatePipe],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss',
})
export class ConfirmationComponent {
  private _router = inject(Router);

  confirmation: BookingConfirmation | null =
    this._router.getCurrentNavigation()?.extras?.state?.['confirmation'] ?? null;
}
