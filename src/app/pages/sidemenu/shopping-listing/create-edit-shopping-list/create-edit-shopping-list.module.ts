import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateEditShoppingListPageRoutingModule } from './create-edit-shopping-list-routing.module';

import { CreateEditShoppingListPage } from './create-edit-shopping-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateEditShoppingListPageRoutingModule
  ],
  declarations: [CreateEditShoppingListPage]
})
export class CreateEditShoppingListPageModule{}
