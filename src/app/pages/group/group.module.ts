import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeGroupPage } from './welcome-group/welcome-group.page';
import { CanActivateGuard } from '../entry/services/can-activate.guard';
import { ManagementGroupPage } from './management-group/management-group.page';
import { GroupViewPage } from './group-view/group-view.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { AddRegisterGrpPage } from './add-register-grp/add-register-grp.page';

const routes: Routes = [
  {
    path: '',
    component: WelcomeGroupPage,
    canActivate : [CanActivateGuard]
  },
  {
    path: 'welcome',
    component: WelcomeGroupPage,
    canActivate : [CanActivateGuard]
  },
  {
    path: 'management',
    component: ManagementGroupPage,
    canActivate : [CanActivateGuard]
  },
  {
    path: 'groupview',
    component: GroupViewPage,
    canActivate : [CanActivateGuard]
  }
];

@NgModule({
  declarations: [
    WelcomeGroupPage,
    GroupViewPage,
    ManagementGroupPage,
    AddRegisterGrpPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forChild(routes),
  ],
  providers:[
    DatePipe
  ]
})
export class GroupModule { }
