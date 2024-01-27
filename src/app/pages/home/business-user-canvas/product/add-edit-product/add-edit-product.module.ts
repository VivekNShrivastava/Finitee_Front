import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AddEditProductPage } from './add-edit-product.page';
import { MultipleMediaUploadComponent } from 'src/app/core/components/mutiple-media-upload/mutiple-media-upload.component';
import { TraitsComponent } from 'src/app/core/components/traits/traits.component';
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: AddEditProductPage }]),
    MultipleMediaUploadComponent,
    TraitsComponent
  ],
  declarations: [
    AddEditProductPage,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddEditProductModule { }