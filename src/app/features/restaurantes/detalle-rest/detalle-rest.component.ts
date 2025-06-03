import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ButtonModule }    from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule }  from 'primeng/textarea';
import { RestauranteService } from 'app/services/restaurante.service';
import { RestauranteRaw } from 'app/models/restaurante.model';

@Component({
  selector: 'app-detalle-rest',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule
  ],
  templateUrl: './detalle-rest.component.html',
  styleUrls: ['./detalle-rest.component.css']
})
export class DetalleRestComponent implements OnInit {
  form: FormGroup;
  isNew = false;
  restauranteId?: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private svc: RestauranteService
  ) {
    this.form = this.fb.group({
      nombre:    ['', Validators.required],
      direccion: ['', Validators.required],
      menu:      ['', Validators.required]
    });
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam === 'nuevo') {
      this.isNew = true;
      // Pre-filling menu con el JSON por defecto
      const defaultMenu = {
        promos: [
          { url: 'https://res.cloudinary.com/dxvrgpfhs/image/upload/v1747746250/WhatsApp_Image_2025-05-20_at_11.24.26_1_vidhgb.jpg', nombre: 'Promo 01', precio: 8.5 },
          { url: 'https://res.cloudinary.com/dxvrgpfhs/image/upload/v1747746250/WhatsApp_Image_2025-05-20_at_11.24.26_1_vidhgb.jpg', nombre: 'Promo 02', precio: 5.0 },
          { url: 'https://res.cloudinary.com/dxvrgpfhs/image/upload/v1747746250/WhatsApp_Image_2025-05-20_at_11.24.26_1_vidhgb.jpg', nombre: 'Promo 03', precio: 8.5 },
          { url: 'https://res.cloudinary.com/dxvrgpfhs/image/upload/v1747746250/WhatsApp_Image_2025-05-20_at_11.24.26_1_vidhgb.jpg', nombre: 'Promo 04', precio: 5.0 }
        ]
      };
      this.form.patchValue({ menu: JSON.stringify(defaultMenu, null, 2) });
    } else if (idParam) {
      this.restauranteId = Number(idParam);
      this.svc.obtener(this.restauranteId).subscribe(rest => {
        this.form.patchValue({
          nombre:    rest.nombre,
          direccion: rest.direccion,
          menu:      JSON.stringify({ promos: rest.promos }, null, 2)
        });
      });
    }
  }

  save() {
    if (this.form.invalid) { return; }

    // 1) parseamos el JSON para validar
    let menuObj: any;
    try {
      menuObj = JSON.parse(this.form.value.menu);
    } catch {
      return alert('El campo menú no contiene un JSON válido.');
    }

    // 2) construimos el payload
 const rawPayload: Partial<RestauranteRaw> = {
  nombre:    this.form.value.nombre,
  direccion: this.form.value.direccion,
  // enviamos el objeto JSON directamente:
  menu:      menuObj
};

    // 3) elegimos endpoint crear vs actualizar
    const request$ = this.isNew
      ? this.svc.crear(rawPayload)
      : this.svc.actualizar(this.restauranteId!, rawPayload);

    request$.subscribe({
      next: () => this.router.navigate(['/restaurantes']),
      error: err => {
        console.error('ERROR RESPONSE BODY:', err.error);
        alert('Error: ' + (err.error?.detail || JSON.stringify(err.error) || err.statusText));
      }
    });
  }

  cancel() {
    // navegación programática garantizada
    this.router.navigate(['/restaurantes']);
  }
}
