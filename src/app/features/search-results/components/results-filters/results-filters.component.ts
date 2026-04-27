import { Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { FlightSearchService } from '../../services/flight-search.service';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-results-filters',
  imports: [ MatFormField, MatLabel, MatSelect, MatOption, ReactiveFormsModule, MatInput],
  templateUrl: './results-filters.component.html',
  styleUrl: './results-filters.component.scss'
})
export class ResultsFiltersComponent {
  private _flightSearch = inject(FlightSearchService);

  form: FormGroup = new FormGroup({
    maxPrice: new FormControl<number | null>(null, [ Validators.min(0) ]),
    sortBy: new FormControl(null)
  });

  private _sortByChanges = toSignal(this.form.get('sortBy')!.valueChanges.pipe(
    debounceTime(300)
  ));

  private _maxPriceChanges = toSignal(this.form.get('maxPrice')!.valueChanges.pipe(
    debounceTime(300)
  ));

  constructor() {
    effect(() => {
      this.form.patchValue({
        maxPrice: this._flightSearch.maxPrice(),
        sortBy: this._flightSearch.sortBy(),
      }, { emitEvent: false })
    });

    effect(() => {
      this._flightSearch.setSort(this._sortByChanges());
    });

    effect(() => {
      this._flightSearch.setMaxPrice(this._maxPriceChanges());
    });

  }

}
