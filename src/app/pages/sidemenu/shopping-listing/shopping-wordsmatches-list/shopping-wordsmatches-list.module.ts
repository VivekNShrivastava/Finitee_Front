import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShoppingWordsmatchesListPageRoutingModule } from './shopping-wordsmatches-list-routing.module';

import { ShoppingWordsmatchesListPage } from './shopping-wordsmatches-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShoppingWordsmatchesListPageRoutingModule
  ],
  declarations: [ShoppingWordsmatchesListPage]
})
export class ShoppingWordsmatchesListPageModule {}
