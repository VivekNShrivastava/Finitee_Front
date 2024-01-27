import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BusinessProductModalPageRoutingModule } from './business-product-modal-routing.module';

import { BusinessProductModalPage } from './business-product-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BusinessProductModalPageRoutingModule
  ],
  declarations: [BusinessProductModalPage]
})
export class BusinessProductModalPageModule {}
