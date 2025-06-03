// auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const userId = this.auth.getUserId();
    // Si no tienes userId, dejamos la petición tal cual
    if (!userId) {
      return next.handle(req);
    }
    // Clonamos la petición y añadimos un header con el userId
    const authReq = req.clone({
      setHeaders: {
        'X-User-Id': userId.toString()
      }
    });
    return next.handle(authReq);
  }
}
