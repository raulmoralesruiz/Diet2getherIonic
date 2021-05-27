import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegimePage } from './regime.page';

const routes: Routes = [
  {
    path: '',
    component: RegimePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegimePageRoutingModule {}
