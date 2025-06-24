import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RestaurantUser } from '../models/restaurant-user.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private endpoint = '/api/users';

  constructor(private apiService: ApiService) {}

  getAllUsers(): Observable<RestaurantUser[]> {
    return this.apiService.get<RestaurantUser[]>(this.endpoint);
  }

  getUserById(id: number): Observable<RestaurantUser> {
    return this.apiService.get<RestaurantUser>(`${this.endpoint}/${id}`);
  }

  createUser(user: RestaurantUser): Observable<RestaurantUser> {
    return this.apiService.post<RestaurantUser>(this.endpoint, user);
  }

  updateUser(id: number, user: RestaurantUser): Observable<RestaurantUser> {
    return this.apiService.put<RestaurantUser>(`${this.endpoint}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.apiService.delete(`${this.endpoint}/${id}`);
  }
}