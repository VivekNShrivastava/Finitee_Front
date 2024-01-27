import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { MultipleMediaUploadComponent } from 'src/app/core/components/mutiple-media-upload/mutiple-media-upload.component';
import { TraitsComponent } from 'src/app/core/components/traits/traits.component';
import { ReportComponent } from './report.component';




@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: ReportComponent }]),
    MultipleMediaUploadComponent,
    TraitsComponent
  ],
  declarations: [
    ReportComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReportModule { }
