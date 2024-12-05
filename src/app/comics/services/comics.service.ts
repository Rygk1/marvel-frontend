import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ComicsService {
  constructor(private https: HttpClient) {}

  getComics(offset: number, limit: number): Observable<any> {
    const params = {
      offset: offset.toString(),
      limit: limit.toString(),
    };
    return this.https.get('http://localhost:3000/marvel/comics', { params });
  }
}
