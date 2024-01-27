import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShoppingListPageRoutingModule } from './shopping-list-routing.module';

import { ShoppingListPage } from './shopping-list.page';
import { AppNotificationIconComponent } from 'src/app/core/components/app-notification-icon/app-notification-icon.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppNotificationIconComponent,
    ShoppingListPageRoutingModule, 
  ],
  declarations: [ShoppingListPage]
})
export class ShoppingListPageModule {}
