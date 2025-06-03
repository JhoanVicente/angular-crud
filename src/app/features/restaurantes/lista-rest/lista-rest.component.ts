import { Component, OnInit }    from '@angular/core';
import { CommonModule }         from '@angular/common';
import { RouterModule, Router } from '@angular/router';

// PrimeNG Modules
import { TableModule }          from 'primeng/table';
import { ButtonModule }         from 'primeng/button';
import { CardModule }           from 'primeng/card';
import { ToolbarModule }        from 'primeng/toolbar';
import { InputTextModule }      from 'primeng/inputtext';

import { Restaurante }          from 'app/models/restaurante.model';
import { RestauranteService }   from 'app/services/restaurante.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-rest',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    ButtonModule,
    CardModule,
    ToolbarModule,
    FormsModule,
    InputTextModule
  ],
  templateUrl: './lista-rest.component.html',
  styleUrls: ['./lista-rest.component.css']
})
export class ListaRestComponent implements OnInit {
  restaurantes: Restaurante[] = [];
  // Para el filtro global
  filtroGlobal: string = '';

  constructor(
    private svc: RestauranteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  /** Carga todos los restaurantes desde el backend */
  loadAll(): void {
    this.svc.listar().subscribe({
      next: data => this.restaurantes = data,
      error: err => console.error('Error cargando restaurantes', err)
    });
  }

  /** Navega a la edición/detalle del restaurante seleccionado */
  verDetalle(r: Restaurante): void {
    this.router.navigate(['/restaurantes', r.idRestaurante!]);
  }

  verCarta(r: Restaurante): void {
    this.router.navigate(['/restaurantes', r.idRestaurante!, 'carta']);
  }

  /** Navega al formulario de creación */
  nuevo(): void {
    this.router.navigate(['/restaurantes', 'nuevo']);
  }

  /** Elimina un restaurante y recarga la lista */
  eliminar(r: Restaurante): void {
    const ok = confirm(`¿Eliminar "${r.nombre}"?`);
    if (ok) {
      this.svc.eliminar(r.idRestaurante!).subscribe(() => this.loadAll());
    }
  }
}
