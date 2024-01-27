import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchPageRoutingModule } from './search-routing.module';

import { SearchPage } from './search.page';
import {
  AppNotificationIconComponent
} from "../../core/components/app-notification-icon/app-notification-icon.component";
import { DateAgoPipe } from 'src/app/core/pipes/date-ago.pipe';
import { PipesModule } from 'src/app/core/pipes/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchPageRoutingModule,
    AppNotificationIconComponent,
    PipesModule
  ],
  declarations: [SearchPage],
})
export class SearchPageModule {}
