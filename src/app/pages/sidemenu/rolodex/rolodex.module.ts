import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { RolodexPage } from './rolodex.page';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: RolodexPage }]),
  ],
  declarations: [
    RolodexPage
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RolodexModule { }
