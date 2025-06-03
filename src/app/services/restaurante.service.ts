// src/app/services/restaurante.service.ts
import { Injectable } from '@angular/core';
import { HttpClient }  from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, map } from 'rxjs';

import { RestauranteRaw, Restaurante, Promo, PromoRaw } from '../models/restaurante.model';

@Injectable({ providedIn: 'root' })
export class RestauranteService {
  private baseUrl = `${environment.apiBase}/restaurantes`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Restaurante[]> {
    return this.http.get<RestauranteRaw[]>(this.baseUrl).pipe(
      map(list => list.map(raw => this.parse(raw)))
    );
  }

  obtener(id: number): Observable<Restaurante> {
    return this.http.get<RestauranteRaw>(`${this.baseUrl}/${id}`).pipe(
      map(raw => this.parse(raw))
    );
  }

  crear(raw: Partial<RestauranteRaw>): Observable<RestauranteRaw> {
    return this.http.post<RestauranteRaw>(this.baseUrl, raw);
  }

  actualizar(id: number, raw: Partial<RestauranteRaw>): Observable<RestauranteRaw> {
    return this.http.put<RestauranteRaw>(`${this.baseUrl}/${id}`, raw);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  listarProductos(restauranteId: number): Observable<Promo[]> {
  return this.http
    .get<PromoRaw[]>(`${environment.apiBase}/productos?restaurante=${restauranteId}`)
    .pipe(
      // 1) filtrar sólo los que sean de este restaurante
      map(list => list.filter(p => p.idRestaurante === restauranteId)),
      // 2) convertir a tu interfaz Promo
      map(list =>
        list.map(raw => ({
          idProducto: raw.idProducto,
          nombre:     raw.nombre,
          precio:     raw.precio,
          url:        raw.urlImagen
        }))
      )
    );
}


  private parse(raw: RestauranteRaw): Restaurante {
    let parsed: any;
    try {
      parsed = JSON.parse(raw.menu);
    } catch {
      parsed = {};
    }

    // Si viniera un objeto plano { "1": 8.99, "2": 5.0 }, lo convertimos:
    if (!Array.isArray(parsed.promos) && typeof parsed === 'object') {
      parsed = {
        promos: Object.entries(parsed).map(([key, precio]) => ({
          url:    '',
          nombre: `Promo ${key}`,
          precio: Number(precio)
        }))
      };
    }

    return {
      idRestaurante: raw.idRestaurante,  // opcional según tu interfaz
      nombre:        raw.nombre,
      direccion:     raw.direccion,
      promos:        Array.isArray(parsed.promos) ? parsed.promos : []
    };
  }
}
