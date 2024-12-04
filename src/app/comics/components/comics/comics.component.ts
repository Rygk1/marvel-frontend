import { Component, inject, OnInit } from '@angular/core';
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
  ],
  templateUrl: './comics.component.html',
  styleUrl: './comics.component.scss',
  providers: [MessageService],
})
export class ComicsComponent implements OnInit {
  myComics: any[] = [];
  totalRecords: number = 0;
  loading: boolean = false;

  marvelService = inject(ComicsService);
  favoriteService = inject(FavoritesService);
  currentComic: any;
  visible: boolean = false;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.getComics();
  }

  getComics() {
    // this.favoriteService.

    this.marvelService.getComics(0, 10).subscribe((comics: any) => {
      if (comics.length === 0) {
        return;
      }
      this.myComics = comics.results;
    });
  }

  loadComics(event: any) {
    this.loading = true;
    const offset = event.first;
    const limit = event.rows;

    this.marvelService.getComics(offset, limit).subscribe({
      next: (data: any) => {
        if (data && data.length === 0) {
          return;
        }
        this.myComics = data.results;
        this.totalRecords = data.total;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar los cómics:', err);
        this.loading = false;
      },
    });
  }

  comicDetails(comic: any) {
    console.log('🚀 ~ ComicsComponent ~ comicDetails ~ comic:', comic);
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
