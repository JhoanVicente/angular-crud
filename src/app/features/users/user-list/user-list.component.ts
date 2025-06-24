import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { RestaurantUser } from '../../../core/models/restaurant-user.model';
import { UserType } from '../../../core/models/user-type.model';
import { UserService } from '../../../core/services/user.service';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule
    // Quitar UserDialogComponent de aquí
  ],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Usuarios</h2>
      <button mat-raised-button color="primary" (click)="openAddDialog()">
        <mat-icon>add</mat-icon> Nuevo Usuario
      </button>
    </div>

    <div class="mb-3">
      <div class="btn-group" role="group">
        <button 
          mat-button 
          [color]="statusFilter === 'all' ? 'primary' : ''" 
          (click)="filterByStatus('all')"
        >
          Todos
        </button>
        <button 
          mat-button 
          [color]="statusFilter === 'A' ? 'primary' : ''" 
          (click)="filterByStatus('A')"
        >
          Activos
        </button>
        <button 
          mat-button 
          [color]="statusFilter === 'I' ? 'primary' : ''" 
          (click)="filterByStatus('I')"
        >
          Inactivos
        </button>
      </div>
      
      <mat-form-field appearance="outline" class="w-100 mt-3">
        <mat-label>Buscar usuario</mat-label>
        <input matInput [(ngModel)]="searchTerm" (input)="applyFilters()" placeholder="Buscar por nombre, apellido o email...">
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>
    </div>

    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre de Usuario</th>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Estado</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let user of filteredUsers">
            <td>{{ user.userId }}</td>
            <td>{{ user.userName }}</td>
            <td>{{ user.names }}</td>
            <td>{{ user.surnames }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.telephone }}</td>
            <td>
              <span [class]="user.state === 'A' ? 'badge bg-success' : 'badge bg-danger'">
                {{ user.state === 'A' ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td>{{ user.userType.name }}</td>
            <td>
              <div class="btn-group">
                <button mat-icon-button color="primary" (click)="openEditDialog(user)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteUser(user)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .w-100 { width: 100%; }
    .mt-3 { margin-top: 1rem; }
  `]
})
export class UserListComponent implements OnInit {
  users: RestaurantUser[] = [];
  filteredUsers: RestaurantUser[] = [];
  statusFilter: string | 'all' = 'all';
  searchTerm: string = '';
  userTypes: UserType[] = [];

  constructor(
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadUserTypes();
  }

  loadUserTypes(): void {
    // Aquí deberías llamar al servicio correspondiente para cargar los tipos de usuario
    // Por ejemplo:
    // this.userService.getUserTypes().subscribe({
    //   next: (data) => {
    //     this.userTypes = data;
    //   },
    //   error: (error) => {
    //     console.error('Error al cargar tipos de usuario', error);
    //   }
    // });
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data; // Inicializar filteredUsers con todos los usuarios
        this.applyFilters(); // Opcional: aplicar filtros iniciales
      },
      error: (error) => {
        console.error('Error al cargar usuarios', error);
      }
    });
  }

  filterByStatus(status: string | 'all'): void {
    this.statusFilter = status;
    this.applyFilters();
  }

  applyFilters(): void {
    let result = this.users;
    
    if (this.statusFilter !== 'all') {
      result = result.filter(user => user.state === this.statusFilter);
    }
    
    if (this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase().trim();
      result = result.filter(user => 
        user.userName.toLowerCase().includes(term) ||
        user.names.toLowerCase().includes(term) ||
        user.surnames.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
    }
    
    this.filteredUsers = result;
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '800px',
      data: {
        title: 'Nuevo Usuario',
        user: {
          userName: '',
          password: '',
          names: '',
          surnames: '',
          dateOfBirth: '',
          address: '',
          telephone: '',
          email: '',
          documentType: '',
          numberType: '',
          state: 'A',
          userType: null
        },
        userTypes: this.userTypes,
        isEdit: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.createUser(result).subscribe({
          next: (newUser) => {
            this.users.push(newUser);
            this.applyFilters();
            console.log('Usuario creado con éxito');
          },
          error: (error) => {
            console.error('Error al crear usuario', error);
          }
        });
      }
    });
  }

  openEditDialog(user: RestaurantUser): void {
    const userToEdit = { ...user };
    
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '800px',
      data: {
        title: 'Editar Usuario',
        user: userToEdit,
        userTypes: this.userTypes,
        isEdit: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && user.userId) {
        this.userService.updateUser(user.userId, result).subscribe({
          next: (updatedUser) => {
            const index = this.users.findIndex(u => u.userId === user.userId);
            if (index !== -1) {
              this.users[index] = updatedUser;
              this.applyFilters();
            }
            console.log('Usuario actualizado con éxito');
          },
          error: (error) => {
            console.error('Error al actualizar usuario', error);
          }
        });
      }
    });
  }

  deleteUser(user: RestaurantUser): void {
    if (confirm(`¿Está seguro de que desea eliminar el usuario "${user.userName}"?`)) {
      if (user.userId) {
        this.userService.deleteUser(user.userId).subscribe({
          next: () => {
            const index = this.users.findIndex(u => u.userId === user.userId);
            if (index !== -1) {
              this.users[index].state = 'I';
              this.applyFilters();
            }
            console.log('Usuario eliminado con éxito');
          },
          error: (error) => {
            console.error('Error al eliminar usuario', error);
          }
        });
      }
    }
  }
}
