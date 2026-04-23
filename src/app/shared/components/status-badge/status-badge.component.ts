import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

type FlightStatus = 'scheduled' | 'delayed' | 'cancelled';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [NgClass],
  template: `
    <span class="badge" [ngClass]="'badge--' + status">
      {{ label }}
    </span>
  `,
  styles: [`
    .badge {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;

      &--scheduled { background: #e8f5e9; color: #2e7d32; }
      &--delayed    { background: #fff3e0; color: #e65100; }
      &--cancelled  { background: #ffebee; color: #c62828; }
    }
  `]
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: FlightStatus;

  get label(): string {
    const labels: Record<FlightStatus, string> = {
      scheduled: 'En hora',
      delayed: 'Retrasado',
      cancelled: 'Cancelado',
    };
    return labels[this.status];
  }
}
