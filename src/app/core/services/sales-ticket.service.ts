import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SalesTicket } from '../models/sales-ticket.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesTicketService {
  private apiUrl = `${environment.apiUrl}/api/sales`;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // Obtener todos los tickets de venta
  getSalesTickets(): Observable<SalesTicket[]> {
    return this.http.get<SalesTicket[]>(this.apiUrl, this.httpOptions);
  }

  // Obtener un ticket de venta por ID
  getSalesTicket(id: number): Observable<SalesTicket> {
    return this.http.get<SalesTicket>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  // Crear un nuevo ticket de venta
  createSalesTicket(salesTicket: SalesTicket): Observable<SalesTicket> {
    return this.http.post<SalesTicket>(this.apiUrl, salesTicket, this.httpOptions);
  }

  // Actualizar un ticket de venta
  updateSalesTicket(id: number, salesTicket: SalesTicket): Observable<SalesTicket> {
    return this.http.put<SalesTicket>(`${this.apiUrl}/${id}`, salesTicket, this.httpOptions);
  }

  // Eliminar un ticket de venta
  deleteSalesTicket(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  // Obtener tickets por estado
  getSalesTicketsByStatus(status: string): Observable<SalesTicket[]> {
    return this.http.get<SalesTicket[]>(`${this.apiUrl}/status/${status}`, this.httpOptions);
  }

  // Obtener tickets por usuario
  getSalesTicketsByUser(userId: number): Observable<SalesTicket[]> {
    return this.http.get<SalesTicket[]>(`${this.apiUrl}/user/${userId}`, this.httpOptions);
  }
} 