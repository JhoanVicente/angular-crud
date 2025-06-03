import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  rol: string;
  idUsuario: number;
  nombre: string;
  email: string;
  // no incluimos password en la respuesta
}

export interface RegisterPayload {
  nombre: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  /** URL base de la API (ajusta según tu backend) */
  private apiBase = `${environment.apiBase}/usuarios`;

  /** Observador para saber si el usuario está autenticado */
  private _isAuthenticated = new BehaviorSubject<boolean>(!!this.getUserId());
  readonly isAuthenticated$ = this._isAuthenticated.asObservable();

  constructor(private http: HttpClient) {}

  /** Login: guarda idUsuario y token (si aplica) en localStorage */
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiBase}/login`, { email, password }).pipe(
      tap((res: any) => {
        localStorage.setItem('userId', res.idUsuario);
        if (res.token) {
          localStorage.setItem('token', res.token);
        }
        this._isAuthenticated.next(true);
      })
    );
  }

  /** Registro de nuevo usuario */
  register(payload: RegisterPayload): Observable<any> {
    return this.http.post(`${this.apiBase}`, payload, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  /** Logout: elimina userId y token del almacenamiento */
  logout(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    this._isAuthenticated.next(false);
  }

  /** Devuelve el userId guardado (o 0 si no existe) */
  getUserId(): number {
    const storedId = localStorage.getItem('userId');
    return storedId ? parseInt(storedId, 10) : 0;
  }
}
