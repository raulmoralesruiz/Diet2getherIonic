import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegimePageRoutingModule } from './regime-routing.module';

import { RegimePage } from './regime.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegimePageRoutingModule
  ],
  declarations: [RegimePage]
})
export class RegimePageModule {}
