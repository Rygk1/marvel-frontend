import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment/enviroment';

@Injectable({
  providedIn: 'root',
})
export class ComicsService {
  private url = environment.apiUrl;

  constructor(private https: HttpClient) {}

  getComics(offset: number, limit: number): Observable<any> {
    const params = {
      offset: offset.toString(),
      limit: limit.toString(),
    };
    return this.https.get(`${this.url}/marvel/comics`, { params });
  }
}
