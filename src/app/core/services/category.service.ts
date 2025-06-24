import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Category } from '../models/category.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la petición HTTP:', {
      url: error.url,
      status: error.status,
      statusText: error.statusText,
      error: error.error,
      message: error.message
    });
    return throwError(() => error);
  }

  getAllCategories(): Observable<Category[]> {
    console.log('Intentando obtener categorías de:', this.apiUrl);
    return this.http.get<Category[]>(this.apiUrl, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category, this.httpOptions);
  }

  updateCategory(id: number, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category, this.httpOptions);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  // Opcionales según backend
  deleteCategoryPhysically(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/physically/${id}`, this.httpOptions);
  }

  restoreCategory(id: number): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/restore/${id}`, {}, this.httpOptions);
  }

  getCategoriesByStatus(status: string): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/status/${status}`);
  }

  searchCategories(term: string): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/search?term=${term}`);
  }
}
