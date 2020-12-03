import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'my-reports',
    pathMatch: 'full'
  },
  {
    path: 'my-reports',
    loadChildren: () => import('./pages/my-reports/my-reports.module').then( m => m.MyReportsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
