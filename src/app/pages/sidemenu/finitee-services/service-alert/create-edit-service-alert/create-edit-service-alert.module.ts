import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateEditServiceAlertPageRoutingModule } from './create-edit-service-alert-routing.module';

import { CreateEditServiceAlertPage } from './create-edit-service-alert.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateEditServiceAlertPageRoutingModule
  ],
  declarations: [CreateEditServiceAlertPage]
})
export class CreateEditServiceAlertPageModule {}
