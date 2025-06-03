import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { concatMap } from 'rxjs/operators';

import { RestauranteService } from 'app/services/restaurante.service';
import { CarritoService } from 'app/services/carrito.service';
import { Promo, Restaurante } from 'app/models/restaurante.model';

@Component({
  selector: 'app-carta',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './carta.component.html',
  styleUrls: ['./carta.component.css']
})
export class CartaComponent implements OnInit {
  restaurante!: Restaurante;
  promos: Promo[] = [];

  constructor(
    private route: ActivatedRoute,
    private svc: RestauranteService,
    private carritoSvc: CarritoService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.svc.obtener(id).pipe(
      concatMap(r => {
        this.restaurante = r;
        return this.svc.listarProductos(id);
      })
    ).subscribe({
      next: productos => this.promos = productos,
      error: err => console.error('Error cargando la carta y sus promos', err)
    });
  }

  agregarAlCarrito(promo: Promo) {
    const item = {
      restauranteId: this.restaurante.idRestaurante!,
      nombre: promo.nombre,
      precio: promo.precio,
      cantidad: 1,
      url: promo.url
    };
    this.carritoSvc.agregar(item);
    this.messageService.add({severity:'success', summary:'Éxito', detail:'Producto añadido'});
  }

  irAlCarrito() {
    this.router.navigate(['/carrito']);
  }
}