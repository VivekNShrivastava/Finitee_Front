import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { AddPostTestPageRoutingModule } from './add-post-test-routing.module';
import { MultipleMediaUploadComponent } from 'src/app/core/components/mutiple-media-upload/mutiple-media-upload.component';
import { NewImageCropperComponent } from 'src/app/core/components/new-image-cropper/new-image-cropper.component';
import { AddPostTestPage } from './add-post-test.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddPostTestPageRoutingModule,
    MultipleMediaUploadComponent,
    NewImageCropperComponent
  ],
  declarations: [AddPostTestPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddPostTestPageModule {}
