import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { NotificationsPage } from './notifications.page';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: NotificationsPage }]),
  ],
  declarations: [NotificationsPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NotificationsPageModule { }
