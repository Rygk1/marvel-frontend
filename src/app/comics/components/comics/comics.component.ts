import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ComicsService } from '../../services/comics.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { NgIf } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { TableModule } from 'primeng/table';
import { FavoritesService } from '../../../favorites/services/favorites.service';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ImportsModule } from '../../../shared/components/imports';
import { Favorite } from '../../services/models/favorites.model';
import { MessageService } from 'primeng/api';
import { combineLatest, map, Subscription } from 'rxjs';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { TokenService } from '../../../shared/services/token.service';

@Component({
  selector: 'app-comics',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    NgIf,
    DataViewModule,
    TagModule,
    CommonModule,
    IconFieldModule,
    TableModule,
    DialogModule,
    DynamicDialogModule,
    ConfirmDialogModule,
    ImportsModule,
    NavbarComponent,
  ],
  templateUrl: './comics.component.html',
  styleUrl: './comics.component.scss',
  providers: [MessageService],
})
export class ComicsComponent implements OnInit, OnDestroy {
  myComics: any[] = [];
  totalRecords: number = 0;
  loading: boolean = false;

  marvelService = inject(ComicsService);
  favoriteService = inject(FavoritesService);
  tokenService = inject(TokenService);

  currentComic: any;
  visible: boolean = false;
  subs: Subscription[] = [];
  isLogedIn: string | null = null;

  constructor(private messageService: MessageService) {}

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.getComics();
  }

  validateLogin() {
    this.isLogedIn = this.tokenService.getToken();
  }

  getComics(event?: any) {
    const offset = event?.first;
    const limit = event?.rows;

    const sub = combineLatest([
      this.marvelService.getComics(offset || 0, limit || 10),
      this.favoriteService.getFavorites(),
    ])
      .pipe(
        map(([comics, favorites]) => {
          const result = this.addFavoriteFlag(comics, favorites);
          comics.results = result;
          return comics;
        })
      )
      .subscribe((comics) => {
        this.myComics = comics.results;
        this.totalRecords = comics.total;
        this.loading = false;
      });
    this.subs.push(sub);
  }

  loadComics(event: any) {
    this.loading = true;
    const offset = event.first;
    const limit = event.rows;

    const sub1 = combineLatest([
      this.marvelService.getComics(offset, limit),
      this.favoriteService.getFavorites(),
    ])
      .pipe(
        map(([comics, favorites]) => {
          const result = this.addFavoriteFlag(comics, favorites);
          comics.results = result;
          return comics;
        })
      )
      .subscribe({
        next: (data: any) => {
          if (data && data.length === 0) {
            return;
          }
          this.myComics = data.results;
          this.totalRecords = data.total;
          this.loading = false;
        },
        error: (err) => {
          this.loadAlert('error', 'Ups, algo ha sucedido', err.message);
          this.loading = false;
        },
      });
    this.subs.push(sub1);
  }

  comicDetails(comic: any) {
    this.currentComic = comic;
    this.visible = true;
  }

  onDialogClose() {
    this.visible = false;
    this.currentComic = null;
  }

  addToFavorites(comic: any) {
    const favorite: Partial<Favorite> = {
      comicId: comic.id,
      description: comic.variantDescription || '',
      thumbnail: comic.thumbnail.path + '.' + comic.thumbnail.extension,
      title: comic.title,
    };
    this.favoriteService.addFavorite(favorite).subscribe({
      next: (response: any) => {
        this.loadAlert('success', 'Todo salió bien!', response.message);
        this.onDialogClose();
        this.addFavoriteFlagById(comic, this.myComics);
      },
      error: (error) => {
        this.loadAlert('error', 'error', error.error.message);
      },
    });
  }

  addFavoriteFlag(comics: any, favorites: Favorite[]) {
    return comics.results.map((comic: any) => ({
      ...comic,
      favorite: favorites.some((fav) => fav.comicId === comic.id),
    }));
  }

  addFavoriteFlagById(currentComic: any, myComics: any[]) {
    this.myComics = myComics.map((comic: any) => ({
      ...comic,
      favorite: currentComic.id === comic.id,
    }));
  }

  removeFavoriteFlagById(myComics: any[]) {
    this.myComics = myComics.map((comic: any) => ({
      ...comic,
      favorite: false,
    }));
  }

  removeToFavorites(id: number) {
    this.favoriteService.removeFavorite(id).subscribe({
      next: (response: any) => {
        this.loadAlert('success', 'Todo salió bien!', response.message);
        this.removeFavoriteFlagById(this.myComics);
        this.onDialogClose();
      },
      error: (error) => {
        this.loadAlert('error', 'error', error.error.message);
      },
    });
  }

  loadAlert(severity: string, summary: string, detail: string) {
    this.messageService.add({
      severity,
      summary,
      detail,
    });
  }
}
