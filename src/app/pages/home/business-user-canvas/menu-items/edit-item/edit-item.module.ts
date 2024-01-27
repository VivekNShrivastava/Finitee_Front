import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { FormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';
import { EditItemPage } from './edit-item.page';
import { MultipleMediaUploadComponent } from 'src/app/core/components/mutiple-media-upload/mutiple-media-upload.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, MultipleMediaUploadComponent, RouterModule.forChild([{ path: '', component: EditItemPage }]),],
  declarations: [EditItemPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EditMenuItemModule { }
