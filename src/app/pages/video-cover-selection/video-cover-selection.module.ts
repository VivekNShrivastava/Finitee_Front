import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VideoCoverSelectionPage } from './video-cover-selection.page';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: VideoCoverSelectionPage }]),
   
  ],
  declarations: [VideoCoverSelectionPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VideoCoverSelectionPageModule {}
