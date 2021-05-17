import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AthleteDataRegisterPageRoutingModule } from './athlete-data-register-routing.module';

import { AthleteDataRegisterPage } from './athlete-data-register.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AthleteDataRegisterPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [AthleteDataRegisterPage]
})
export class AthleteDataRegisterPageModule {}
