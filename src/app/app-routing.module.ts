import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'my-reports',
    loadChildren: () => import('./pages/my-reports/my-reports.module').then( m => m.MyReportsPageModule)
  },
  {
    path: 'new-report',
    loadChildren: () => import('./pages/new-report/new-report.module').then( m => m.NewReportPageModule)
  },
  {
    path: 'update',
    loadChildren: () => import('./pages/new-report/new-report.module').then( m => m.NewReportPageModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then( m => m.AdminPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then( m => m.AuthPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
