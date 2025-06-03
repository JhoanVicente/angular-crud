// header.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule }    from '@angular/common';
import { RouterModule }    from '@angular/router';
import { MegaMenuItem }    from 'primeng/api';
import { MegaMenuModule }  from 'primeng/megamenu';
import { DialogModule }    from 'primeng/dialog';
import { ButtonModule }    from 'primeng/button';
import { LoginComponent }  from 'app/features/auth/login/login.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MegaMenuModule,
    DialogModule,
    ButtonModule,
    LoginComponent
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  menuItems: MegaMenuItem[] = [];
  loginDialogVisible = false;

ngOnInit(): void {
  this.menuItems = [
    { label: 'Nuestras Promociones', routerLink: ['/promos'] },
    { label: 'Cupones',      routerLink: ['/coupons'] },
    { label: 'Ubicación',    routerLink: ['/locations'] }
  ];
}

  showLoginDialog(): void {
    this.loginDialogVisible = true;
  }
}
