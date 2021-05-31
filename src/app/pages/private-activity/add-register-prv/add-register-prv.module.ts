import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddRegisterPrvPageRoutingModule } from './add-register-prv-routing.module';

import { AddRegisterPrvPage } from './add-register-prv.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddRegisterPrvPageRoutingModule
  ],
  declarations: [AddRegisterPrvPage]
})
export class AddRegisterPrvPageModule {}
