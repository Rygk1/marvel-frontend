import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ImportsModule } from '../../../shared/components/imports';
import { FavoritesService } from '../../services/favorites.service';
import { Favorite } from '../../../comics/models/favorites.model';
import { TokenService } from '../../../shared/services/token.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { map, pipe, Subscription } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [ImportsModule, NavbarComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class FavoritesComponent implements OnInit, OnDestroy {
  favoriteService = inject(FavoritesService);
  tokenService = inject(TokenService);
  myFavorites: Favorite[] = [];
  userId: any;
  subs: Subscription[] = [];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    const sub = this.favoriteService
      .getFavorites()

      .subscribe((favorites: Favorite[]) => {
        const sorted = favorites.sort((a, b) => b.id - a.id);
        this.myFavorites = sorted;
      });
    this.subs.push(sub);
  }

  getUserid() {
    return this.tokenService.getUserIdToken();
  }

  validate(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Desea eliminar el comic de favoritos?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.removeToFavorites(id);
      },
    });
  }

  removeToFavorites(id: number) {
    this.favoriteService.removeFavorite(id).subscribe({
      next: (response: any) => {
        this.removeFavoriteById(this.myFavorites, id);
        this.loadAlert('success', 'Todo salió bien!', response.message);
      },
      error: (error) => {
        this.loadAlert('error', 'error', error.error.message);
      },
    });
  }

  removeFavoriteById(myFavorites: Favorite[], id: number) {
    this.myFavorites = myFavorites.filter((fav) => fav.comicId !== id);
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  loadAlert(severity: string, summary: string, detail: string) {
    this.messageService.add({
      severity,
      summary,
      detail,
    });
  }
}
