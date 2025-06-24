import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderStatusType } from '../models/order-status-type.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderStatusTypeService {
  private apiUrl = `${environment.apiUrl}/api/order-status-types`;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  getOrderStatusTypes(): Observable<OrderStatusType[]> {
    return this.http.get<OrderStatusType[]>(this.apiUrl, this.httpOptions);
  }

  getOrderStatusType(id: number): Observable<OrderStatusType> {
    return this.http.get<OrderStatusType>(`${this.apiUrl}/${id}`, this.httpOptions);
  }
} 