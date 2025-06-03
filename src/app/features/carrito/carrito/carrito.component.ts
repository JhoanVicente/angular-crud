import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

import { PedidoService } from 'app/services/pedido.service';
import { CarritoService } from 'app/services/carrito.service';
import { CarritoItem } from 'app/models/carrito-item.model';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputNumberModule,
    ToastModule,
    DialogModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  items: CarritoItem[] = [];
  total = 0;
  displayDialog = false;
  orderSummary = false;

  constructor(
    public carritoSvc: CarritoService,
    private pedSvc: PedidoService,
    private router: Router,
    private auth: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.carritoSvc.items$.subscribe(list => {
      this.items = list;
      this.updateTotal();
    });
  }

  updateTotal() {
    this.total = this.items.reduce(
      (sum, item) => sum + item.precio * item.cantidad,
      0
    );
  }

  onQtyChange(item: CarritoItem) {
    this.updateTotal();
  }

  remove(item: CarritoItem) {
    this.carritoSvc.removeItem(item);
  }

  confirmCancel() {
    this.confirmationService.confirm({
      message: '¿Deseas anular la compra? Esta acción no se puede deshacer.',
      accept: () => this.cancelOrder()
    });
  }

  cancelOrder() {
    this.carritoSvc.vaciar();
    this.messageService.add({severity:'warn', summary:'Carrito', detail:'Compra anulada'});
  }

  confirmFinish() {
    this.confirmationService.confirm({
      message: '¿Confirmas finalizar el pedido? Una vez enviado, no podrás modificarlo.',
      accept: () => this.finishOrder()
    });
  }

  finishOrder() {
    if (!this.items.length) return;
    this.displayDialog = true;
  }
}