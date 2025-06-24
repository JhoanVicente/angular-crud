import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SalesTicket } from '../../../core/models/sales-ticket.model';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { OrderStatusType } from '../../../core/models/order-status-type.model';
import { PaymentType } from '../../../core/models/payment-type.model';
import { OrderStatusTypeService } from '../../../core/services/order-status-type.service';
import { PaymentTypeService } from '../../../core/services/payment-type.service';
import { Category } from '../../../core/models/category.model';
import { CategoryService } from '../../../core/services/category.service';
import { RestaurantUser } from '../../../core/models/restaurant-user.model';
import { UserService } from '../../../core/services/user.service';

interface DialogData {
  title: string;
  salesTicket: SalesTicket;
  isEdit: boolean;
  isView?: boolean;
}

@Component({
  selector: 'app-sales-ticket-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatIconModule,
    MatSnackBarModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }
  ],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <form [formGroup]="salesTicketForm" (ngSubmit)="onSubmit()">
      <div mat-dialog-content>
        <!-- Información básica -->
        <div class="row">
          <div class="col-md-6">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>Fecha de Venta</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="saleDate" [max]="maxDate">
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-error *ngIf="salesTicketForm.get('saleDate')?.hasError('required')">
                La fecha es requerida
              </mat-error>
            </mat-form-field>
          </div>

          <div class="col-md-6">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>Delivery</mat-label>
              <mat-select formControlName="delivery">
                <mat-option value="SI">Sí</mat-option>
                <mat-option value="NO">No</mat-option>
              </mat-select>
              <mat-error *ngIf="salesTicketForm.get('delivery')?.hasError('required')">
                El delivery es requerido
              </mat-error>
            </mat-form-field>
          </div>
        </div>

        <!-- Dirección de delivery -->
        <div class="row" *ngIf="salesTicketForm.get('delivery')?.value === 'SI'">
          <div class="col-12">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>Dirección de Delivery</mat-label>
              <input matInput formControlName="deliveryAddress">
              <mat-error *ngIf="salesTicketForm.get('deliveryAddress')?.hasError('required')">
                La dirección es requerida para delivery
              </mat-error>
            </mat-form-field>
          </div>
        </div>

        <!-- Tipo de pago -->
        <div class="row">
          <div class="col-md-6">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>Tipo de Pago</mat-label>
              <mat-select formControlName="paymentType">
                <mat-option *ngFor="let type of paymentTypes" [value]="type">
                  {{type.name}}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="salesTicketForm.get('paymentType')?.hasError('required')">
                El tipo de pago es requerido
              </mat-error>
            </mat-form-field>
          </div>
          <!-- Selector de Cliente/Usuario -->
          <div class="col-md-6">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>Cliente</mat-label>
              <mat-select formControlName="user">
                <mat-option *ngFor="let user of users" [value]="user">
                  {{user.names}} {{user.surnames}}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="salesTicketForm.get('user')?.hasError('required')">
                El cliente es requerido
              </mat-error>
            </mat-form-field>
          </div>
        </div>

        <!-- Nota -->
        <div class="row">
          <div class="col-12">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>Nota</mat-label>
              <textarea matInput formControlName="note" rows="3"></textarea>
            </mat-form-field>
          </div>
        </div>

        <!-- Sección de Productos -->
        <div class="mt-4">
          <h3>Productos</h3>
          
          <!-- Selector de Categoría y Producto (Visible solo en modo edición/creación) -->
          <div class="row mb-3" *ngIf="!data.isView">
            <div class="col-md-6">
              <mat-form-field appearance="outline" class="w-100">
                <mat-label>Categoría</mat-label>
                <mat-select [(value)]="selectedCategory" (selectionChange)="onCategoryOrProductSelectionChange()">
                  <mat-option [value]="null">Todas</mat-option>
                  <mat-option *ngFor="let category of categories" [value]="category">
                    {{category.name}}
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            <div class="col-md-6">
              <mat-form-field appearance="outline" class="w-100">
                <mat-label>Seleccionar Producto</mat-label>
                <mat-select [(value)]="selectedProduct" (selectionChange)="onCategoryOrProductSelectionChange()" [disabled]="!availableProducts || availableProducts.length === 0">
                  <mat-option *ngFor="let product of availableProducts" [value]="product">
                    {{product.name}} - {{product.price | currency:'PEN':'symbol'}}
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </div>

          <!-- Cantidad y Botón Agregar (Visible solo en modo edición/creación) -->
          <div class="row mb-3" *ngIf="!data.isView">
             <div class="col-md-6">
              <mat-form-field appearance="outline" class="w-100">
                <mat-label>Cantidad</mat-label>
                <input matInput type="number" [(ngModel)]="selectedQuantity" 
                       min="1" 
                       [disabled]="!selectedProduct" 
                       [ngModelOptions]="{standalone: true}"
                       (ngModelChange)="onQuantityChange($event)">
              </mat-form-field>
            </div>
            <div class="col-md-6 d-flex align-items-end">
              <button mat-raised-button color="primary" class="w-100" 
                      type="button"
                      (click)="addProduct()" 
                      [disabled]="!selectedProduct">
                <mat-icon>add</mat-icon>
                Agregar
              </button>
            </div>
          </div>

          <!-- Tabla de productos (Siempre visible si hay productos) -->
          <div class="table-responsive">
            <table mat-table [dataSource]="productDetails" class="mat-elevation-z8">
              <!-- Producto Column -->
              <ng-container matColumnDef="product">
                <th mat-header-cell *matHeaderCellDef>Producto</th>
                <td mat-cell *matCellDef="let element">{{element.product.name}}</td>
              </ng-container>

              <!-- Cantidad Column -->
              <ng-container matColumnDef="quantity">
                <th mat-header-cell *matHeaderCellDef>Cantidad</th>
                <td mat-cell *matCellDef="let element">{{element.quantity}}</td>
              </ng-container>

              <!-- Precio Unitario Column -->
              <ng-container matColumnDef="unitPrice">
                <th mat-header-cell *matHeaderCellDef>Precio Unit.</th>
                <td mat-cell *matCellDef="let element">{{element.unitPrice | currency:'PEN':'symbol'}}</td>
              </ng-container>

              <!-- Subtotal Column -->
              <ng-container matColumnDef="subtotal">
                <th mat-header-cell *matHeaderCellDef>Subtotal</th>
                <td mat-cell *matCellDef="let element">{{element.subtotal | currency:'PEN':'symbol'}}</td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let element; let i = index">
                  <button mat-icon-button color="warn" (click)="removeProduct(i)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="productColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: productColumns;"></tr>
            </table>
          </div>

          <!-- Total -->
          <div class="d-flex justify-content-end mt-3">
            <h3>Total: {{calculateTotal() | currency:'PEN':'symbol'}}</h3>
          </div>
        </div>
      </div>

      <div mat-dialog-actions align="end" *ngIf="!data.isView">
        <button mat-button type="button" (click)="onCancel()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" 
                [disabled]="salesTicketForm.invalid || productDetails.length === 0">
          Realizar Compra
        </button>
      </div>
    </form>
  `,
  styles: [`
    .row {
      display: flex;
      flex-wrap: wrap;
      margin-right: -15px;
      margin-left: -15px;
    }
    .col-md-6 {
      flex: 0 0 50%;
      max-width: 50%;
      padding-right: 15px;
      padding-left: 15px;
    }
    .col-md-4 {
      flex: 0 0 33.333333%;
      max-width: 33.333333%;
      padding-right: 15px;
      padding-left: 15px;
    }
    .col-md-2 {
      flex: 0 0 16.666667%;
      max-width: 16.666667%;
      padding-right: 15px;
      padding-left: 15px;
    }
    .col-12 {
      flex: 0 0 100%;
      max-width: 100%;
      padding-right: 15px;
      padding-left: 15px;
    }
    .w-100 {
      width: 100%;
    }
    .mt-4 {
      margin-top: 1.5rem;
    }
    .mb-3 {
      margin-bottom: 1rem;
    }
    .mt-3 {
      margin-top: 1rem;
    }
    .d-flex {
      display: flex;
    }
    .justify-content-end {
      justify-content: flex-end;
    }
    .align-items-end {
      align-items: flex-end;
    }
    .table-responsive {
      margin-top: 1rem;
    }
    table {
      width: 100%;
    }
  `]
})
export class SalesTicketDialogComponent implements OnInit {
  salesTicketForm: FormGroup;
  products: Product[] = [];
  availableProducts: Product[] = [];
  categories: Category[] = [];
  paymentTypes: PaymentType[] = [
    { idPaymentType: 1, name: 'Efectivo' },
    { idPaymentType: 2, name: 'Tarjeta de Crédito' },
    { idPaymentType: 3, name: 'Tarjeta de Débito' },
    { idPaymentType: 4, name: 'Transferencia Bancaria' }
  ];
  productDetails: any[] = [];
  productColumns: string[] = ['product', 'quantity', 'unitPrice', 'subtotal', 'actions'];
  selectedCategory: Category | null = null;
  selectedProduct: Product | null = null;
  selectedQuantity: number = 1;
  maxDate: Date = new Date();
  users: RestaurantUser[] = [];

  constructor(
    private dialogRef: MatDialogRef<SalesTicketDialogComponent>,
    private fb: FormBuilder,
    private productService: ProductService,
    private orderStatusTypeService: OrderStatusTypeService,
    private paymentTypeService: PaymentTypeService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    const initialDate = this.data.salesTicket?.saleDate 
      ? new Date(this.data.salesTicket.saleDate)
      : new Date();

    this.salesTicketForm = this.fb.group({
      saleDate: [initialDate, Validators.required],
      delivery: [this.data.salesTicket?.delivery || 'NO', Validators.required],
      deliveryAddress: [this.data.salesTicket?.deliveryAddress],
      note: [this.data.salesTicket?.note],
      paymentType: [this.data.salesTicket?.paymentType, Validators.required],
      user: [this.data.salesTicket?.user, Validators.required]
    });

    if (this.data.isView) {
      this.salesTicketForm.disable();
    }

    if (this.data.salesTicket && this.data.salesTicket.productDetails) {
      this.productDetails = [...this.data.salesTicket.productDetails];
    }
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadPaymentTypes();
    this.loadUsers();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filterAvailableProducts(); // Filtrar inicialmente
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.snackBar.open('Error al cargar los productos', 'Cerrar', { duration: 3000 });
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.snackBar.open('Error al cargar las categorías', 'Cerrar', { duration: 3000 });
      }
    });
  }

  loadPaymentTypes(): void {
    this.paymentTypeService.getPaymentTypes().subscribe({
      next: (types) => {
        if (types && types.length > 0) {
          this.paymentTypes = types;
        }
        // Si no hay tipos de pago del backend, usamos los predeterminados
      },
      error: (error) => {
        console.error('Error loading payment types:', error);
        // Si hay error, usamos los tipos de pago predeterminados
        this.snackBar.open('Usando tipos de pago predeterminados', 'Cerrar', { duration: 3000 });
      }
    });
  }

  loadUsers(): void {
    // --- Debugging output ---
    console.log('Attempting to load users...');
    // --- End Debugging output ---
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        // --- Debugging output ---
        console.log('All users received from service:', users);
        // --- End Debugging output ---
        
        // Filtrar usuarios por tipo 'Cliente'
        this.users = users.filter(user => user.userType?.name === 'Cliente');

        // --- Debugging output ---
        console.log('Filtered users (Clientes):', this.users);
        // --- End Debugging output ---
      },
      error: (error) => {
        // --- Debugging output ---
        console.error('Error loading users:', error);
        // --- End Debugging output ---
        // Manejar error, tal vez mostrar un mensaje al usuario
      }
    });
  }

  onCategoryOrProductSelectionChange(): void {
    // Al cambiar categoría o producto, reseteamos la cantidad si no hay producto seleccionado
    if (!this.selectedProduct) {
      this.selectedQuantity = 1;
    }
    this.filterAvailableProducts();
  }

  filterAvailableProducts(): void {
    let filtered = this.products;

    // 1. Filtrar por categoría si hay una seleccionada
    if (this.selectedCategory) {
      filtered = filtered.filter(product => product.category?.id === this.selectedCategory?.id);
    }

    // 2. Filtrar productos que ya están en el detalle actual
    this.availableProducts = filtered.filter(product => 
      !this.productDetails.some(detail => detail.product.id === product.id)
    );

    
    if (this.selectedProduct && !this.availableProducts.some(product => product.id === this.selectedProduct?.id)) {
        this.selectedProduct = null;
        this.selectedQuantity = 1;
    }
  }

  addProduct(): void {
    // Verificar que hay un producto seleccionado y la cantidad es un número positivo
    if (this.selectedProduct && typeof this.selectedQuantity === 'number' && this.selectedQuantity > 0) {
      // --- Debugging output ---
      console.log('Selected Quantity before adding:', this.selectedQuantity);
      // --- End Debugging output ---

      const detail = {
        product: this.selectedProduct, // Referencia al producto seleccionado
        quantity: this.selectedQuantity, // Usamos la cantidad seleccionada aquí
        unitPrice: this.selectedProduct.price,
        subtotal: this.selectedProduct.price * this.selectedQuantity
      };

      // --- Debugging output ---
      console.log('Product detail being added:', detail);
      // --- End Debugging output ---

      // Crear una nueva referencia de array para que MatTable detecte el cambio
      this.productDetails = [...this.productDetails, detail];
      
      this.filterAvailableProducts(); // Volver a filtrar después de agregar
      
      // Resetear selección y cantidad para el próximo producto
      this.selectedProduct = null;
      this.selectedQuantity = 1;

      this.snackBar.open('Producto agregado', 'Cerrar', { duration: 2000 });
    } else {
      // Este else se activaría si no hay producto o la cantidad no es válida
      this.snackBar.open('Seleccione un producto y especifique una cantidad válida mayor a 0', 'Cerrar', { duration: 3000 });
    }
  }

  removeProduct(index: number): void {
    // Crear una nueva referencia de array para que MatTable detecte el cambio
    this.productDetails = this.productDetails.filter((_, i) => i !== index);

    this.filterAvailableProducts(); // Volver a filtrar después de eliminar
    this.snackBar.open('Producto eliminado', 'Cerrar', { duration: 2000 });
  }

  calculateTotal(): number {
    return this.productDetails.reduce((total, detail) => total + (detail.subtotal || 0), 0);
  }

  onSubmit(): void {
    if (this.salesTicketForm.valid && this.productDetails.length > 0) {
      const formValue = this.salesTicketForm.value;

      // Construir un DTO para enviar al backend, extrayendo IDs y reestructurando productDetails
      const salesTicketDtoForBackend = {
        saleDate: formValue.saleDate, // Asumimos que el backend puede manejar Date o string de fecha
        totalPayment: this.calculateTotal(),
        delivery: formValue.delivery,
        deliveryAddress: formValue.deliveryAddress,
        note: formValue.note,
        userId: formValue.user.userId, // Enviar solo el ID del usuario
        idTypeState: formValue.orderStatusType?.idTypeState || 1, // Enviar solo el ID del estado (usando 1 como default si no está en el form)
        idPaymentType: formValue.paymentType.idPaymentType, // Enviar solo el ID del tipo de pago
        productDetails: this.productDetails.map(detail => ({
          productId: detail.product.id, // Enviar solo el ID del producto
          amount: detail.quantity // Usar 'amount' si eso espera el backend para cantidad
        }))
      };

      // --- Debugging output ---
      console.log('Data being sent to backend (DTO):', salesTicketDtoForBackend);
      // --- End Debugging output ---

      this.dialogRef.close(salesTicketDtoForBackend); // Cerrar con el DTO para backend

    } else {
      this.snackBar.open('Por favor complete todos los campos requeridos y agregue al menos un producto', 'Cerrar', { duration: 3000 });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  // Método para manejar el cambio en la cantidad y depurar
  onQuantityChange(newValue: number): void {
    console.log('Selected Quantity changed to:', newValue);
  }
} 