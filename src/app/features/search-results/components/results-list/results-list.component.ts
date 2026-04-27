import { Component, inject } from '@angular/core';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { FlightSearchService } from '../../services/flight-search.service';
import { Flight } from '../../../../core/models/flight.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-results-list',
  imports: [FlightCardComponent],
  templateUrl: './results-list.component.html',
  styleUrl: './results-list.component.scss'
})
export class ResultsListComponent {
  private _flightSearch = inject(FlightSearchService);
  private _router = inject(Router);

  filteredFlights = this._flightSearch.filteredFlights;

  bookFlight(flight: Flight): void {
    this._router.navigate(['/booking', flight.id]);
  }
}
