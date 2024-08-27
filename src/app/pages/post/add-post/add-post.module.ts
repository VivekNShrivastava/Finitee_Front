import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { MultipleMediaUploadComponent } from 'src/app/core/components/mutiple-media-upload/mutiple-media-upload.component';
import { TraitsComponent } from 'src/app/core/components/traits/traits.component';
import { AddPostPage } from './add-post.page';
import { ImageCropperComponent } from 'src/app/core/components/image-cropper/image-cropper.component';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: AddPostPage }]),
    MultipleMediaUploadComponent,
    TraitsComponent,
    ImageCropperComponent
  ],
  declarations: [
    AddPostPage
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddPostModule { }
