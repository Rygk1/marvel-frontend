import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { TokenService } from '../../shared/services/token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  registerUser(user: {
    name: string;
    identification: string;
    email: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(user: { email: string; password: string }): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/login`, user)
      .pipe(
        tap((response: any) => this.tokenService.saveToken(response.token))
      );
  }
}
