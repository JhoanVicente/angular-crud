export interface Plato {
  id: number;
  name: string;
  image: string;
  price: number;
  category: string;
  inventoryStatus: 'INSTOCK' | 'LOWSTOCK' | 'OUTOFSTOCK';
  rating: number;
}
