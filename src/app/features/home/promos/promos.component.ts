import { Component, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PromoService } from 'app/services/promo.service';

import { HeaderComponent } from 'app/shared/header/header.component';
import { Promo } from 'app/models/restaurante.model';

@Component({
  selector: 'app-promos',
  templateUrl: './promos.component.html',
  styleUrls: ['./promos.component.css'],
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    FormsModule,
    HeaderComponent
  ],
  providers: [PromoService],
})
export class PromosComponent implements OnInit {
  promos = signal<Promo[]>([]);

  constructor(private promoService: PromoService) {}

  ngOnInit() {
    this.promoService.listarTodas()
      .subscribe(ps => this.promos.set(ps));
  }

  get primerosSeis(): Promo[] {
    return this.promos().slice(0, 6);
  }
}
