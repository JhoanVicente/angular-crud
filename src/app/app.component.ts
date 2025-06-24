import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, HeaderComponent],
    template: `
    <app-header></app-header>
    <main class="container py-4">
      <router-outlet></router-outlet>
    </main>
  `,
    styles: []
})
export class AppComponent {
  title = 'restlospinos-frontend';
}