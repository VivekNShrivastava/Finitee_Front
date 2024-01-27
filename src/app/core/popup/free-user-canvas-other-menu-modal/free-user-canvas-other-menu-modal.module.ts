import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FreeUserCanvasOtherMenuModalPageRoutingModule } from './free-user-canvas-other-menu-modal-routing.module';

import { FreeUserCanvasOtherMenuModalPage } from './free-user-canvas-other-menu-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FreeUserCanvasOtherMenuModalPageRoutingModule
  ],
  declarations: [FreeUserCanvasOtherMenuModalPage]
})
export class FreeUserCanvasOtherMenuModalPageModule {}
