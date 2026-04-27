import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResultsHeaderComponent } from "./components/results-header/results-header.component";
import { ResultsListComponent } from "./components/results-list/results-list.component";
import { ResultsSpinnerComponent } from "./components/results-spinner/results-spinner.component";
import { ResultsErrorComponent } from "./components/results-error/results-error.component";
import { ResultsFiltersComponent } from "./components/results-filters/results-filters.component";
import { FlightSearchService } from './services/flight-search.service';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [
    ResultsHeaderComponent,
    ResultsListComponent,
    ResultsSpinnerComponent,
    ResultsErrorComponent,
    ResultsFiltersComponent
  ],
  providers: [
    FlightSearchService
  ],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss',
})
export class SearchResultsComponent {
  private _route = inject(ActivatedRoute);
  private _flightSearch = inject(FlightSearchService);

  isLoading = this._flightSearch.isLoading;
  error = this._flightSearch.error;

  ngOnInit(): void {
    const qp = this._route.snapshot.queryParams;
    this._flightSearch.setParams({
      origin: qp['origin'] ?? '',
      destination: qp['destination'] ?? '',
      date: qp['date'] ?? '',
      passengers: Number(qp['passengers'] ?? 1),
    });
  }
}
