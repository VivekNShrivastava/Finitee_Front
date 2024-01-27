import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AddTraitsPage } from './add-traits.page';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: AddTraitsPage }]),
  ],
  declarations: [
    AddTraitsPage
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddTraitsModule { }
