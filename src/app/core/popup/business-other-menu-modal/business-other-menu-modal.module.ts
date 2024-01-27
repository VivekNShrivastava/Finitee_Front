import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BusinessOtherMenuModalPageRoutingModule } from './business-other-menu-modal-routing.module';

import { BusinessOtherMenuModalPage } from './business-other-menu-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BusinessOtherMenuModalPageRoutingModule
  ],
  declarations: [BusinessOtherMenuModalPage]
})
export class BusinessOtherMenuModalPageModule {}
