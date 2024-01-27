import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CustomFilterPipe } from 'src/app/core/pipes/filter';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MultipleMediaUploadComponent } from 'src/app/core/components/mutiple-media-upload/mutiple-media-upload.component';
import { TraitsComponent } from 'src/app/core/components/traits/traits.component';
import { EditTraitPageComponent } from './edit-trait-page.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: EditTraitPageComponent }]),
    MultipleMediaUploadComponent,
    TraitsComponent
  ],
  declarations: [
    EditTraitPageComponent
  ],providers:[
    CustomFilterPipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EditTraitModule { }