import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegimePage } from './regime/regime.page';
import { CanActivateGuard } from '../entry/services/can-activate.guard';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { SelectDishPage } from './select-dish/select-dish.page';
import { CreateDishPage } from './create-dish/create-dish.page';

const routes: Routes = [
  {
    path: '',
    component: RegimePage,
    canActivate : [CanActivateGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    RegimePage,
    SelectDishPage,
    CreateDishPage
  ],
})
export class RegimeModule { }
