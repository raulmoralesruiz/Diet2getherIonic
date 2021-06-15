import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {
  //   path: 'home',
  //   loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  // },
  {
    path: '',
    loadChildren: () => import('./pages/entry/welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/entry/welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/entry/log-in/log-in.module').then( m => m.LogInPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/entry/sign-up/sign-up.module').then( m => m.SignUpPageModule)
  },
  {
    path: 'athlete',
    loadChildren: () => import('./pages/entry/athlete-data-register/athlete-data-register.module').then( m => m.AthleteDataRegisterPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'regime',
    loadChildren: () => import('./pages/regime/regime.module').then( m => m.RegimeModule)
  },
  {
    // path: 'friends',
    path: 'social',
    loadChildren: () => import('./pages/social/friends/friends.module').then( m => m.FriendsPageModule)
  },
  {
    path:'private',
    loadChildren: () => import("./pages/private-activity/private.module").then(m => m.PrivateModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
