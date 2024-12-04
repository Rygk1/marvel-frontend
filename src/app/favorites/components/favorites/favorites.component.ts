import { Component } from '@angular/core';
import { ImportsModule } from '../../../shared/components/imports';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [ImportsModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
})
export class FavoritesComponent {}
