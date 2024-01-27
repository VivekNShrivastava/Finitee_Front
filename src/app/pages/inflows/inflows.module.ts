import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InflowsPageRoutingModule } from './inflows-routing.module';

import { InflowsPage } from './inflows.page';
import { AppNotificationIconComponent } from 'src/app/core/components/app-notification-icon/app-notification-icon.component';
import { PostItemsComponent } from 'src/app/core/components/post/post-items/post-items.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostItemsComponent,
    InflowsPageRoutingModule,
    AppNotificationIconComponent
  ],
  declarations: [InflowsPage]
})
export class InflowsPageModule {}
