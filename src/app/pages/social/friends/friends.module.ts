import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FriendsPageRoutingModule } from './friends-routing.module';

import { FriendsPage } from './friends.page';
import { HttpClientModule } from '@angular/common/http';
import { AddFriendPageModule } from '../add-friend/add-friend.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FriendsPageRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    AddFriendPageModule
  ],
  declarations: [FriendsPage]
})
export class FriendsPageModule {}
