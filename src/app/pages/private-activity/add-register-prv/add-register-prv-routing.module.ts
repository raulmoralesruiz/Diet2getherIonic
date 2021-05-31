import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddRegisterPrvPage } from './add-register-prv.page';

const routes: Routes = [
  {
    path: '',
    component: AddRegisterPrvPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddRegisterPrvPageRoutingModule {}
