// src/app/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Necesario si usas routerLink en el template, aunque no directamente en Home
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { HeaderComponent } from 'app/shared/header/header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CarouselModule,
    TagModule,
    HeaderComponent 
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] // Este CSS ahora solo contendrá estilos para el contenido del home
})
export class HomeComponent implements OnInit {
  promotions = [
    { name: '50% OFF', image: 'assets/images/promo1.jpeg', price: '50% OFF', tag: 'LIMITED TIME' },
    { name: 'Burger Olvidada', image: 'assets/images/promo2.jpeg', price: '$10.99', tag: 'NEW' },
    { name: 'Combo Familiar', image: 'assets/images/promo3.jpeg', price: '$25.99', tag: 'POPULAR' }
  ];

  responsiveOptions = [
    { breakpoint: '1400px', numVisible: 2, numScroll: 1 },
    { breakpoint: '1199px', numVisible: 3, numScroll: 1 },
    { breakpoint: '767px', numVisible: 2, numScroll: 1 },
    { breakpoint: '575px', numVisible: 1, numScroll: 1 }
  ];


  constructor() { }

  ngOnInit(): void {
  }

  getSeverity(tag: string): string {
    return ({ 'LIMITED TIME': 'danger', 'NEW': 'success', 'POPULAR': 'warn' }[tag] ?? 'info');
  }

}