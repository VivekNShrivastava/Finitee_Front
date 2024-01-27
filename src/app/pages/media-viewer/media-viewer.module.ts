import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';



import { MediaViewerPage } from './media-viewer.page';
import { MediaViewerPageRoutingModule } from './media-viewer-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MediaViewerPageRoutingModule
  ],
  declarations: [MediaViewerPage]
})
export class MediaViewerPageModule {}
