// src/app/services/pedido.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Pedido {
  id?: number;
  usuarioId: number;
  items: { productoId: number; cantidad: number; }[];
  total: number;
  estado?: string;
  // otros campos de tu API
}

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private baseUrl = `${environment.apiBase}/pedidos`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.baseUrl);
  }

  obtener(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.baseUrl}/${id}`);
  }

 crear(pedido: any): Observable<Pedido> {
  return this.http.post<Pedido>(this.baseUrl, pedido);
}

  actualizar(id: number, pedido: Partial<Pedido>): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.baseUrl}/${id}`, pedido);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
