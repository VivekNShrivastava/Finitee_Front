import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { SalesItemViewPage } from './sales-item-view.page';



@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: SalesItemViewPage }]),
  ],
  declarations: [
    SalesItemViewPage
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SalesItemViewModule { }
