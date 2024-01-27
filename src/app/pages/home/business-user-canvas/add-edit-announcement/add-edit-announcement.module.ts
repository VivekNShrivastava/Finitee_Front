import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { MultipleMediaUploadComponent } from 'src/app/core/components/mutiple-media-upload/mutiple-media-upload.component';
import { TraitsComponent } from 'src/app/core/components/traits/traits.component';
import { AddEditAnnouncementPage } from './add-edit-announcement.page';
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: AddEditAnnouncementPage }]),
    MultipleMediaUploadComponent,
    TraitsComponent
  ],
  declarations: [
    AddEditAnnouncementPage,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddEditAnnouncementModule { }