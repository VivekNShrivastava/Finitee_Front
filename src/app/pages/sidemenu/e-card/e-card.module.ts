import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ECardPage } from './e-card.page';

import { QRCodeModule } from 'angularx-qrcode';




@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    QRCodeModule,
    RouterModule.forChild([{ path: '', component: ECardPage }]),
  ],
  declarations: [
    ECardPage
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ECardModule { }
