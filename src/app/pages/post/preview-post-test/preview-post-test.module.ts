import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreviewPostTestPageRoutingModule } from './preview-post-test-routing.module';

import { PreviewPostTestPage } from './preview-post-test.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreviewPostTestPageRoutingModule
  ],
  declarations: [PreviewPostTestPage]
})
export class PreviewPostTestPageModule {}
