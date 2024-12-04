import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Favorite } from '../../comics/services/models/favorites.model';
import { TokenService } from '../../shared/services/token.service';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  url = 'http://localhost:3000/';

  constructor(private https: HttpClient, private tokenService: TokenService) {}

  addFavorite(favorite: Partial<Favorite>) {
    const userId = this.tokenService.getUserIdToken();
    console.log('🚀 ~ FavoritesService ~ addFavorite ~ userId:', userId);
    console.log('🚀 ~ FavoritesService ~ addFavorite ~ favorite:', favorite);

    return this.https.post(`${this.url}favorites/${userId}`, favorite);
  }

  getFavorites() {
    // return this.https.get(`${this.url}/favorites`, favorite);
  }
}
