import { Component, OnInit }      from '@angular/core';
import { CommonModule }           from '@angular/common';
import { RouterOutlet }           from '@angular/router';
import { NavbarComponent }        from './shared/navbar/navbar/navbar.component';
import { FooterComponent }        from './shared/footer/footer/footer.component';
import { AuthService }            from './services/auth.service';
import { HttpClientModule }       from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    HttpClientModule      // Para que HttpClient y tus servicios funcionen
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoggedIn = false;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    // Nos suscribimos al estado de autenticación
    this.auth.isAuthenticated$.subscribe(flag => {
      this.isLoggedIn = flag;
    });
  }

  onLogout() {
    this.auth.logout();
  }
}
