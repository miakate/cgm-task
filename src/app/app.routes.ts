import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'repos',
    pathMatch: 'full',
  },
  {
    path: 'repos',
    loadComponent: () =>
      import('./features/repos/repo-list.component').then((m) => m.RepoListComponent),
  },
  {
    path: 'commits/:owner/:repo',
    loadComponent: () =>
      import('./features/commits/commits.component').then((m) => m.CommitsComponent),
  },
];
