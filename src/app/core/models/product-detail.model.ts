import { Product } from './product.model';
import { SalesTicket } from './sales-ticket.model';

export interface ProductDetail {
    idProductDetail?: number;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    product: Product;
    salesTicket: SalesTicket;
} 