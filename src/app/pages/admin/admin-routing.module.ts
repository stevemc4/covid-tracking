import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminPage } from './admin.page';

const routes: Routes = [
  {
    path: '',
    component: AdminPage,
  },
  
  {
    path: 'reports',
    loadChildren: () => import('./reports/reports.module').then( m => m.ReportsPageModule)
  },
  {
    path: 'regions',
    loadChildren: () => import('./regions/regions.module').then( m => m.RegionsPageModule)
  },
  {
    path: 'regions/:province',
    loadChildren: () => import('./regions/regions.module').then( m => m.RegionsPageModule)
  },
  {
    path: 'regions/:province/:city',
    loadChildren: () => import('./regions/regions.module').then( m => m.RegionsPageModule)
  },
  {
    path: 'regions/:province/:city/:district',
    loadChildren: () => import('./reports/reports.module').then( m => m.ReportsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule {}
