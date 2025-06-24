import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-header',
    imports: [RouterLink],
    template: `
    <header class="bg-primary text-white p-3">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center">
          <h1 class="m-0">RestLosPinos</h1>
          <nav>
            <ul class="list-unstyled d-flex gap-3 m-0">
              <li><a routerLink="/products" class="text-white text-decoration-none">Productos</a></li>
              <li><a routerLink="/categories" class="text-white text-decoration-none">Categorías</a></li>
              <li><a routerLink="/users" class="text-white text-decoration-none">Usuarios</a></li>
              <li><a routerLink="/sales-tickets" class="text-white text-decoration-none">Tickets de Venta</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  `,
    styles: [`
    header {
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
  `]
})
export class HeaderComponent {}