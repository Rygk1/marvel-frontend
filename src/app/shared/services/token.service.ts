import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor() {}

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUserIdToken() {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken: any = jwtDecode(token);
      const userId = decodedToken.userId;
      return userId;
    }
  }

  clearToken() {
    localStorage.removeItem('token');
  }
}
