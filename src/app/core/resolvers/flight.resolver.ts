import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { Flight } from '../models/flight.model';
import { inject } from '@angular/core';
import { FlightService } from '../services/flight.service';
import { catchError, of, tap } from 'rxjs';

export const flightResolver: ResolveFn<Flight> = (route, state) => {
  const flightService = inject(FlightService);
  const router = inject(Router);

  return flightService.getById(route.paramMap.get('id')!).pipe(
    tap(flight => console.log(flight)),
    //map(...toDto),
    catchError(error => {
      console.log(error);
      return of(new RedirectCommand(router.parseUrl('/home')));
    })
  );
};
