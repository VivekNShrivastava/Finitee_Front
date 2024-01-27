import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ServiceRequiredViewPage } from './service-required-view.page';



@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: ServiceRequiredViewPage }]),
  ],
  declarations: [
    ServiceRequiredViewPage
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ServiceRequiredViewModule { }
