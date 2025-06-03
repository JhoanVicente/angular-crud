// src/app/services/carrito.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CarritoItem } from '../models/carrito-item.model';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private itemsSubj = new BehaviorSubject<CarritoItem[]>([]);
  items$ = this.itemsSubj.asObservable();

  /** Añade cantidad al ítem (o lo crea) */
  agregar(item: CarritoItem) {
    const items = [...this.itemsSubj.value];
    const idx = items.findIndex(i =>
      i.restauranteId === item.restauranteId && i.nombre === item.nombre
    );
    if (idx > -1) {
      items[idx].cantidad += item.cantidad;
    } else {
      items.push({ ...item });
    }
    this.itemsSubj.next(items);
  }

  /** Elimina completamente un ítem */
  removeItem(item: CarritoItem) {
    const filtered = this.itemsSubj.value.filter(i =>
      !(i.restauranteId === item.restauranteId && i.nombre === item.nombre)
    );
    this.itemsSubj.next(filtered);
  }

  /** Vacía todo el carrito */
  vaciar() {
    this.itemsSubj.next([]);
  }
}
