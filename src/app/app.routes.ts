import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'flights',
    loadComponent: () =>
      import('./features/search-results/search-results.component').then(
        m => m.SearchResultsComponent
      ),
  },
  {
    path: 'booking/:id',
    loadComponent: () =>
      import('./features/booking/booking.component').then(m => m.BookingComponent),
  },
  {
    path: 'confirmation',
    loadComponent: () =>
      import('./features/confirmation/confirmation.component').then(
        m => m.ConfirmationComponent
      ),
  },
  {
        path: 'passengers',
        loadComponent: () =>
          import('./features/passenger-book/passenger-book.component').then(
            m => m.PassengerBookComponent
          ),
  },
  { path: '**', redirectTo: '' },
];
