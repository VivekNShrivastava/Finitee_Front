import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { ConnectionsPage } from './connections.page';
import { RouterModule } from '@angular/router';
import { AppNotificationIconComponent } from 'src/app/core/components/app-notification-icon/app-notification-icon.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppNotificationIconComponent,
    RouterModule.forChild([{ path: '', component: ConnectionsPage }])
  ],
  declarations: [ConnectionsPage]
})
export class ConnectionsPageModule { }
