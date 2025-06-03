import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  UrlTree
} from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Si tenemos un userId válido (>0), dejamos pasar
  const userId = auth.getUserId();
  if (userId > 0) {
    return true;
  }

  // En caso contrario, redirigimos a login
  return router.parseUrl('/login');
};
