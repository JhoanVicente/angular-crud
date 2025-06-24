import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: 'products',
    loadChildren: () => import('./features/products/product.routes')
      .then(m => m.PRODUCT_ROUTES)
  },
  { 
    path: 'categories',
    loadComponent: () => import('./features/categories/category-list/category-list.component')
      .then(m => m.CategoryListComponent)
  },
  { 
    path: 'users',
    loadComponent: () => import('./features/users/user-list/user-list.component')
      .then(m => m.UserListComponent)
  },
  {
    path: 'sales-tickets',
    loadChildren: () => import('./features/sales-tickets/sales-ticket.routes')
      .then(m => m.SALES_TICKET_ROUTES)
  },
  { path: '', redirectTo: '/products', pathMatch: 'full' },
];