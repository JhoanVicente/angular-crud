import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { Product } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';
import { ProductDialogComponent } from '../../../features/products/product-list/product-dialog.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    ProductDialogComponent,
    ConfirmDialogComponent
  ]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  loading = false;
  error = '';
  showInactive = false;
  displayedColumns: string[] = ['id', 'imageUrl', 'name', 'description', 'price', 'category', 'status', 'actions'];
  dataSource: MatTableDataSource<Product>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  searchControl = new FormControl('');
  categoryFilterControl = new FormControl('');
  statusFilterControl = new FormControl('');

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<Product>([]);
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.setupFilters();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Configurar el ordenamiento
    this.dataSource.sortingDataAccessor = (item: Product, property: string): string | number => {
      switch(property) {
        case 'id': return Number(item.id) || 0;
        case 'price': return Number(item.price) || 0;
        case 'name': return item.name?.toLowerCase() || '';
        case 'category': return item.category?.name?.toLowerCase() || '';
        case 'status': return item.status ? '1' : '0';
        default: return '';
      }
    };

    // Asegurar que el ordenamiento se aplique inmediatamente
    this.dataSource.sort.sortChange.subscribe(() => {
      this.dataSource.data = [...this.dataSource.data];
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';
    const obs = this.showInactive
      ? this.productService.getInactiveProducts()
      : this.productService.getProducts();
    obs.subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error completo:', error);
        this.error = `Error al cargar los productos: ${error.message || 'Error desconocido'}`;
        this.loading = false;
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data: Category[]) => {
        this.categories = data;
      },
      error: (error: any) => {
        console.error('Error al cargar las categorías:', error);
        this.error = `Error al cargar las categorías: ${error.message || 'Error desconocido'}`;
      }
    });
  }

  toggleInactive(): void {
    this.showInactive = !this.showInactive;
    this.loadProducts();
  }

  restoreProduct(id: number): void {
    this.productService.restoreProduct(id).subscribe({
      next: () => {
        this.loadProducts();
      },
      error: (error: any) => {
        this.error = 'Error al restaurar el producto';
      }
    });
  }

  openProductDialog(product?: Product): void {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      data: {
        title: product ? 'Editar Producto' : 'Nuevo Producto',
        product: product || {
          name: '',
          description: '',
          price: 0,
          status: true,
          imageUrl: '',
          category: null
        },
        categories: this.categories,
        isEdit: !!product
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (product?.id) {
          this.productService.updateProduct(product.id, result).subscribe({
            next: () => {
              this.loadProducts();
            },
            error: (error: any) => {
              console.error('Error al actualizar:', error);
              this.error = 'Error al actualizar el producto';
            }
          });
        } else {
          this.productService.createProduct(result).subscribe({
            next: () => {
              this.loadProducts();
            },
            error: (error: any) => {
              console.error('Error al crear:', error);
              this.error = 'Error al crear el producto';
            }
          });
        }
      }
    });
  }

  deleteProduct(id: number): void {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      const product = this.products.find(p => p.id === id);
      if (!product) {
        this.error = 'Producto no encontrado';
        return;
      }
      const updatedProduct = { ...product, status: false };
      this.productService.updateProduct(id, updatedProduct).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (error: any) => {
          this.error = 'Error al eliminar el producto';
        }
      });
    }
  }

  setupFilters(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => this.applyFilter());

    this.categoryFilterControl.valueChanges.subscribe(() => this.applyFilter());
    this.statusFilterControl.valueChanges.subscribe(() => this.applyFilter());
  }

  applyFilter(): void {
    this.dataSource.filterPredicate = (data: Product, filter: string) => {
      const searchMatch = (data.name?.toLowerCase().includes(this.searchControl.value?.toLowerCase() || '') ||
        data.description?.toLowerCase().includes(this.searchControl.value?.toLowerCase() || ''));

      const categoryFilterValue = this.categoryFilterControl.value;
      const categoryMatch = !categoryFilterValue || 
        (data.category?.id !== undefined && data.category.id === (typeof categoryFilterValue === 'string' ? Number(categoryFilterValue) : categoryFilterValue));

      const statusValue = this.statusFilterControl.value;
      const statusMatch = statusValue === '' || 
        data.status?.toString() === statusValue;

      return searchMatch && categoryMatch && statusMatch;
    };

    this.dataSource.filter = 'trigger'; // Trigger the filter
  }
}
