import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CustomFilterPipe } from 'src/app/core/pipes/filter';
import { NewTraitPageComponent } from './new-trait-page.component';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MultipleMediaUploadComponent } from 'src/app/core/components/mutiple-media-upload/mutiple-media-upload.component';
import { TraitsComponent } from 'src/app/core/components/traits/traits.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: NewTraitPageComponent }]),
    MultipleMediaUploadComponent,
    TraitsComponent
  ],
  declarations: [
    NewTraitPageComponent
  ],providers:[
    CustomFilterPipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NewTraitPageModule { }