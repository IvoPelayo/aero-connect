import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  
  if(auth.isAuthenticated()) {
    const r = req.clone({
        setHeaders: {
          "Authorization": "Bearer " + auth.getToken()
        }
      });

    return next(r);
  }

  return next(req);
};
