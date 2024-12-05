import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

import { ImportsModule } from '../imports';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ImportsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  router = inject(Router);
  tokenService = inject(TokenService);

  isLogedIn: string | null = null;

  items: MenuItem[] | undefined;

  ngOnInit() {
    this.validateLogin();
    this.items = [
      {
        label: 'Comics',
        icon: 'pi pi-home',
        command: () => this.moveTo('comics'),
        visible: this.isLogedIn ? true : false,
      },
      {
        label: 'Favoritos',
        icon: 'pi pi-star',
        command: () => this.moveTo('favorites'),
        visible: this.isLogedIn ? true : false,
      },
    ];
  }

  validateLogin() {
    this.isLogedIn = this.tokenService.getToken();
  }

  moveTo(url: String) {
    this.router.navigate([`user/${url}`]);
  }

  logUser() {
    if (this.isLogedIn) {
      this.tokenService.clearToken();
      this.validateLogin();
    }
    this.router.navigate(['/login']);
  }
}
