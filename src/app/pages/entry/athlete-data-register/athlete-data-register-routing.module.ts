import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AthleteDataRegisterPage } from './athlete-data-register.page';

const routes: Routes = [
  {
    path: '',
    component: AthleteDataRegisterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AthleteDataRegisterPageRoutingModule {}
