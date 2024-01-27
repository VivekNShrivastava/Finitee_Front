import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';


import { AppNotificationIconComponent } from 'src/app/core/components/app-notification-icon/app-notification-icon.component';
import { MultipleMediaUploadComponent } from 'src/app/core/components/mutiple-media-upload/mutiple-media-upload.component';
import { TraitsComponent } from 'src/app/core/components/traits/traits.component';
import { CreateEditServiceRequiredPage } from './create-edit-service-required.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: CreateEditServiceRequiredPage }]),
    AppNotificationIconComponent,
    MultipleMediaUploadComponent,
    TraitsComponent
  ],
  declarations: [
    CreateEditServiceRequiredPage
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CreateEditServiceRequiredModule { }
