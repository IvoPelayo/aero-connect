import { ResolveFn } from '@angular/router';
import { Flight } from '../models/flight.model';

export const flightResolver: ResolveFn<Flight> = (route, state) => {
  return {} as Flight;
};
