import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/components/register/register.component';
import { LoginComponent } from './auth/components/login/login.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { ComicsComponent } from './comics/components/comics/comics.component';
import { FavoritesComponent } from './favorites/components/favorites/favorites.component';
import { authGuardFn } from './shared/components/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'user',
    canActivate: [authGuardFn],
    children: [
      {
        path: 'favorites',
        component: FavoritesComponent,
      },
      {
        path: 'comics',
        component: ComicsComponent,
      },
      // Ruta "catch-all" para rutas no definidas dentro de /user
      { path: '**', component: PageNotFoundComponent },
    ],
  },
  // { path: '**', component: LoginComponent },
];
