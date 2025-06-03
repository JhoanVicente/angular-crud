// src/app/services/promo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';             // 1) Asegúrate de importar HttpClient
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';                         // 2) Importa map desde rxjs/operators
import { PromoRaw, Promo } from 'app/models/restaurante.model';

@Injectable({ providedIn: 'root' })
export class PromoService {
  private url = `${environment.apiBase}/productos`;

  // 3) Inyecta HttpClient en el constructor
  constructor(private http: HttpClient) {}

  listarTodas(): Observable<Promo[]> {
    return this.http.get<PromoRaw[]>(this.url).pipe(
      map((list: PromoRaw[]) =>                // 4) Ahora `list` es PromoRaw[]
        list.map(raw => ({
          idProducto: raw.idProducto,
          nombre:     raw.nombre,
          precio:     raw.precio,
          url:        raw.urlImagen
        }))
      )
    );
  }

  listarPorRestaurante(restauranteId: number): Observable<Promo[]> {
    return this.http
      .get<PromoRaw[]>(`${this.url}?restaurante=${restauranteId}`)
      .pipe(
        map((list: PromoRaw[]) =>
          list
            .filter(p => p.idRestaurante === restauranteId)
            .map(raw => ({
              idProducto: raw.idProducto,
              nombre:     raw.nombre,
              precio:     raw.precio,
              url:        raw.urlImagen
            }))
        )
      );
  }
}
