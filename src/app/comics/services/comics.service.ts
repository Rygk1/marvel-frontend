import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ComicsService {
  constructor(private https: HttpClient) {}

  getComics(offset: number, limit: number) {
    const params = {
      offset: offset.toString(),
      limit: limit.toString(),
    };
    return this.https.get('http://localhost:3000/marvel/comics', { params });
  }
}
