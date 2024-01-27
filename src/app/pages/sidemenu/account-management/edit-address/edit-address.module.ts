import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { EditAddressComponent } from './edit-address.component';


@NgModule({
  declarations: [EditAddressComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component:  EditAddressComponent}])
  ],
})
export class EditAddressModule { }
