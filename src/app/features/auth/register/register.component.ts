import { Component }    from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';
import { Router, RouterModule }       from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { UsuarioService, Usuario } from 'app/services/usuario.service';
import { finalize }   from 'rxjs/operators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule,RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  nombre   = '';
  email    = '';
  password = '';
  error    = '';
  loading  = false;

  constructor(
    private userSvc: UsuarioService,
    private router: Router
  ) {}

  onSubmit() {
    // limpia mensaje
    this.error = '';

    // validación
    if (!this.nombre || !this.email || !this.password) {
      this.error = 'Todos los campos son obligatorios';
      return;
    }

    // evita reenvíos
    this.loading = true;

    // payload
    const nuevo: Usuario = {
      nombre: this.nombre,
      email: this.email,
      password: this.password
    };

    console.log('🚀 Registrando usuario:', nuevo);

    this.userSvc.crear(nuevo)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: usuario => {
          console.log('✅ Registro exitoso:', usuario);
          this.router.navigate(['/login']);
        },
        error: err => {
          console.error('❌ Error registro:', err);
          this.error = err.error?.message || 'No se pudo registrar';
        }
      });
  }
}
