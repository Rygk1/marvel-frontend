import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Favorite } from '../../comics/services/models/favorites.model';
import { TokenService } from '../../shared/services/token.service';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  url = 'http://localhost:3000/';

  constructor(private https: HttpClient, private tokenService: TokenService) {}

  addFavorite(favorite: Partial<Favorite>) {
    const userId = this.tokenService.getUserIdToken();
    return this.https.post(`${this.url}favorites/${userId}`, favorite);
  }

  removeFavorite(id: number): Observable<{ message: string }> {
    const userId = this.tokenService.getUserIdToken();
    return this.https.delete<{ message: string }>(
      `${this.url}favorites/${userId}/${id}`
    );
  }

  getFavorites(): Observable<Favorite[]> {
    const userId = this.tokenService.getUserIdToken();
    const favorites = this.https.get<Favorite[]>(
      `${this.url}favorites/${userId}`
    );
    return favorites;
  }
}
