import { Component, OnInit, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Category } from '../../../core/models/category.model';
import { CategoryService } from '../../../core/services/category.service';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';

// Componente ConfirmDialog definido aquí para evitar error de importación
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <div mat-dialog-content>
      <p>{{ data.message }}</p>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">{{ data.cancelText }}</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">{{ data.confirmText }}</button>
    </div>
  `
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string; confirmText: string; cancelText: string }
  ) {}
}

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Categorías</h2>
      <button mat-raised-button color="primary" (click)="openAddDialog()" [disabled]="loading">
        <mat-icon>add</mat-icon> Nueva Categoría
      </button>
    </div>
    
    <div class="mb-3">
      <div class="btn-group" role="group">
        <button 
          mat-button 
          [color]="statusFilter === 'all' ? 'primary' : ''" 
          (click)="filterByStatus('all')"
          [disabled]="loading"
        >
          Todos
        </button>
        <button 
          mat-button 
          [color]="statusFilter === 'active' ? 'primary' : ''" 
          (click)="filterByStatus('active')"
          [disabled]="loading"
        >
          Activos
        </button>
        <button 
          mat-button 
          [color]="statusFilter === 'inactive' ? 'primary' : ''" 
          (click)="filterByStatus('inactive')"
          [disabled]="loading"
        >
          Inactivos
        </button>
      </div>
      
      <mat-form-field appearance="outline" class="w-100 mt-3">
        <mat-label>Buscar categoría</mat-label>
        <input 
          matInput 
          [(ngModel)]="searchTerm" 
          (input)="applyFilters()" 
          placeholder="Buscar por nombre..."
          [disabled]="loading"
        >
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>
    </div>
    
    <div *ngIf="loading" class="text-center my-3">
      <mat-spinner diameter="40"></mat-spinner>
    </div>
    
    <div class="mat-elevation-z8 table-responsive" *ngIf="!loading">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let category of filteredCategories">
            <td>{{ category.id }}</td>
            <td>{{ category.name }}</td>
            <td>
              <span [class]="category.status === 'A' ? 'badge bg-success' : 'badge bg-danger'">
                {{ category.status === 'A' ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td>
              <button 
                mat-icon-button 
                color="primary" 
                (click)="openEditDialog(category)" 
                [disabled]="loading"
                matTooltip="Editar Categoría"
              >
                <mat-icon>edit</mat-icon>
              </button>
              <button 
                mat-icon-button 
                color="warn" 
                (click)="deleteCategory(category)" 
                [disabled]="loading || category.status !== 'A'"
                [matTooltip]="category.status !== 'A' ? 'La categoría no está activa' : 'Inactivar Categoría'"
              >
                <mat-icon>delete</mat-icon>
              </button>
              
              <button 
                mat-icon-button 
                color="accent" 
                (click)="confirmRestoreCategory(category)" 
                [disabled]="loading || category.status !== 'I'"
                [matTooltip]="category.status !== 'I' ? 'La categoría no está inactiva' : 'Restaurar Categoría'"
                *ngIf="category.status === 'I'"
              >
                <mat-icon>restore</mat-icon>
              </button>
            </td>
          </tr>
          <tr *ngIf="filteredCategories.length === 0 && !loading">
            <td colspan="4" class="text-center">No se encontraron categorías</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .w-100 { width: 100%; }
    .mt-3 { margin-top: 1rem; }
    .badge { padding: 0.25em 0.4em; font-weight: 700; border-radius: 0.25rem; color: white; }
    .bg-success { background-color: #28a745 !important; }
    .bg-danger { background-color: #dc3545 !important; }
    .table-responsive { max-height: 600px; overflow-y: auto; }
  `]
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  statusFilter: 'all' | 'active' | 'inactive' = 'all';
  searchTerm: string = '';
  loading = false;
  error: string | null = null;
  
  private categoryService = inject(CategoryService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        this.error = `Error al cargar las categorías: ${error.message || 'Error desconocido'}. Status: ${error.status}, StatusText: ${error.statusText}`;
        this.loading = false;
      }
    });
  }

  filterByStatus(status: 'all' | 'active' | 'inactive'): void {
    this.statusFilter = status;
    this.applyFilters();
  }

  applyFilters(): void {
    let result = this.categories;

    if (this.statusFilter !== 'all') {
      const filterStatus = this.statusFilter === 'active' ? 'A' : 'I';
      result = result.filter(category => category.status === filterStatus);
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      result = result.filter(category =>
        category.name.toLowerCase().includes(term)
      );
    }

    this.filteredCategories = result;
  }

  openAddDialog(): void {
    if (this.loading) return;

    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '400px',
      data: {
        title: 'Nueva Categoría',
        category: { name: '', status: 'A' },
        isEdit: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.categoryService.createCategory(result).subscribe({
          next: (newCategory) => {
            this.categories.push(newCategory);
            this.applyFilters();
            this.loading = false;
            console.log('Categoría creada con éxito');
          },
          error: (error) => {
            console.error('Error al crear categoría', error);
            this.loading = false;
          }
        });
      }
    });
  }

  openEditDialog(category: Category): void {
    if (this.loading) return;

    const categoryToEdit = { ...category };

    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '400px',
      data: {
        title: 'Editar Categoría',
        category: categoryToEdit,
        isEdit: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && category.id) {
        this.loading = true;
        this.categoryService.updateCategory(category.id, result).subscribe({
          next: (updatedCategory) => {
            const index = this.categories.findIndex(c => c.id === category.id);
            if (index !== -1) {
              this.categories[index] = updatedCategory;
              this.applyFilters();
            }
            this.loading = false;
            console.log('Categoría actualizada con éxito');
          },
          error: (error) => {
            console.error('Error al actualizar categoría', error);
            this.loading = false;
          }
        });
      }
    });
  }

  deleteCategory(category: Category): void {
    if (this.loading || category.status !== 'A') return; // No hacer nada si está cargando o no está activo

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar inactivación',
        message: `¿Está seguro de que desea inactivar la categoría "${category.name}"?`,
        confirmText: 'Inactivar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && category.id) {
        this.loading = true;
        // Aquí llamamos a updateCategory para cambiar el estado a 'I'
        const updatedCategory: Category = { ...category, status: 'I' };
        this.categoryService.updateCategory(category.id, updatedCategory).subscribe({
          next: () => {
            // Actualizar el estado en la lista local sin recargar todos los datos
            const index = this.categories.findIndex(c => c.id === category.id);
            if (index !== -1) {
              this.categories[index].status = 'I';
              this.applyFilters(); // Re-aplicar filtros para actualizar la vista
            }
            this.loading = false;
            console.log('Categoría inactivada con éxito');
          },
          error: (error) => {
            console.error('Error al inactivar categoría', error);
            this.loading = false;
          }
        });
      }
    });
  }

  confirmRestoreCategory(category: Category): void {
    if (this.loading || category.status !== 'I') return; // No hacer nada si está cargando o no está inactivo

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar restauración',
        message: `¿Está seguro de que desea restaurar la categoría "${category.name}"?`,
        confirmText: 'Restaurar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && category.id) {
        this.restoreCategory(category.id);
      }
    });
  }

  restoreCategory(id: number): void {
    this.loading = true;
    this.categoryService.restoreCategory(id).subscribe({
      next: () => {
        // Actualizar el estado en la lista local sin recargar todos los datos
        const index = this.categories.findIndex(c => c.id === id);
        if (index !== -1) {
          this.categories[index].status = 'A';
          this.applyFilters(); // Re-aplicar filtros para actualizar la vista
        }
        this.loading = false;
        console.log('Categoría restaurada con éxito');
      },
      error: (error) => {
        console.error('Error al restaurar categoría', error);
        this.loading = false;
      }
    });
  }
}