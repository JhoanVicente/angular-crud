// src/app/models/restaurante.model.ts

export interface RestauranteRaw {
  idRestaurante: number;
  nombre: string;
  direccion: string;
  menu: string;      // JSON stringificado
}

// Interfaz “cruda” tal como viene del backend de productos
export interface PromoRaw {
  idProducto:    number;
  nombre:        string;
  descripcion:   string;
  precio:        number;
  categoria:     string;
  disponible:    boolean;
  urlImagen:     string;   // ojo: “urlImagen”, no “url_imagen”
  idRestaurante: number;
}

export interface Promo {
  idProducto: number;
  nombre:     string;
  precio:     number;
  url:        string;
}

export interface Restaurante {
  idRestaurante: number;
  nombre:        string;
  direccion:     string;
  promos:        Promo[];
}
