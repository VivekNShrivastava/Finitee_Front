import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ServiceAvailableViewPage } from './service-available-view.page';



@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: ServiceAvailableViewPage }]),
  ],
  declarations: [
    ServiceAvailableViewPage
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ServiceAvailableViewModule { }
