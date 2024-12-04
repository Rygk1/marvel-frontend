import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

import { ImportsModule } from '../imports';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ImportsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  router = inject(Router);

  items: MenuItem[] | undefined;
  ngOnInit() {
    this.items = [
      {
        label: 'Comics',
        icon: 'pi pi-home',
        routerLink: 'user/comics',
      },
      {
        label: 'Favoritos',
        icon: 'pi pi-star',
        routerLink: 'user/favorites',
      },
    ];
  }

  logUser() {
    this.router.navigate(['/login']);
    console.log('salir');
  }
}
