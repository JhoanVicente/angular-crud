// plato.service.ts
import { Injectable } from '@angular/core';
import { Plato } from 'app/features/restaurantes/carta/plato';

@Injectable({ providedIn: 'root' })
export class PlatoService {
  private platos: Plato[] = [
    { id: 1, name: 'Promo 01',   image: '/assets/images/promo1.jpeg', price: 8.50, category: 'Tacos',      inventoryStatus: 'INSTOCK',   rating: 4 },
    { id: 2, name: 'Promo 02', image: '/assets/images/promo2.jpeg', price: 9.00, category: 'Enchiladas', inventoryStatus: 'INSTOCK',   rating: 5 },
    { id: 3, name: 'Promo 03',       image: '/assets/images/promo3.jpeg', price: 7.00, category: 'Quesadillas',inventoryStatus: 'LOWSTOCK', rating: 3 },
    { id: 4, name: 'Promo 04',   image: '/assets/images/promo4.png',  price: 10.00, category: 'Rellenos', inventoryStatus: 'INSTOCK',   rating: 4 },
    { id: 5, name: 'Promo 05',         image: '/assets/images/promo5.png',  price: 5.50, category: 'Entradas',   inventoryStatus: 'INSTOCK',   rating: 5 },
    { id: 6, name: 'Promo 06',       image: '/assets/images/promo6.jpg',  price: 4.00, category: 'Postres',    inventoryStatus: 'INSTOCK',   rating: 4 }
  ];

  getPlatos(): Promise<Plato[]> {
    return Promise.resolve(this.platos);
  }
}
