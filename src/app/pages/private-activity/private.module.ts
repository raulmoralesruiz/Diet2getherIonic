import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// import { NgxPaginationModule } from 'ngx-pagination';

// Componentes
import { CanActivateGuard } from '../entry/services/can-activate.guard';
import { WelcomePrivatePage } from './welcome-private/welcome-private.page';
import { ViewPrivatePage } from './view-private/view-private.page';
import { ManagementPrivatePage } from './management-private/management-private.page';
import { IonicModule } from '@ionic/angular';
import { AddRegisterPrvPage } from './add-register-prv/add-register-prv.page';

const routes: Routes = [
  {
    path: '',
    component: WelcomePrivatePage,
    canActivate : [CanActivateGuard]
  },
  {
    path: 'welcome',
    component: WelcomePrivatePage,
    canActivate : [CanActivateGuard]
  },
  {
    path: 'management',
    component: ManagementPrivatePage,
    canActivate : [CanActivateGuard]
  },
  {
    path: 'privateview',
    component: ViewPrivatePage,
    canActivate : [CanActivateGuard]
  }
];


@NgModule({
  declarations: [
    WelcomePrivatePage,
    ViewPrivatePage,
    ManagementPrivatePage,
    AddRegisterPrvPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    HttpClientModule,
    // NgxPaginationModule,
    RouterModule.forChild(routes),
  ],
  providers:[
    DatePipe
  ]
})
export class PrivateModule { }
