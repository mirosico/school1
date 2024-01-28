import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'teachers',
    loadComponent: () =>
      import('./features/teachers/teachers-list/teachers-list.component').then(
        (m) => m.TeachersListComponent
      ),
  },
  {
    path: 'teachers-blocked-time',
    loadComponent: () =>
      import('./features/teachers/teachers-blocked-time/teachers-blocked-time.component').then(
        (m) => m.TeachersBlockedTimeComponent
      ),
  }
];
