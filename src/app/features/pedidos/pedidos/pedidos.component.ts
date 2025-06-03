import { Component, OnInit }     from '@angular/core';
import { CommonModule }          from '@angular/common';

import { PedidoService, Pedido } from 'app/services/pedido.service';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {
  pedidos: Pedido[] = [];

  constructor(private svc: PedidoService) {}

  ngOnInit() {
    this.svc.listar().subscribe(data => this.pedidos = data);
  }
}
