import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditPasswordRoutingModule } from './edit-password-routing.module';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { EditPasswordComponent } from './edit-password.component';
@NgModule({
  declarations: [EditPasswordComponent],
  imports: [
    CommonModule,
    EditPasswordRoutingModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: EditPasswordComponent }])

  ]
})
export class EditPasswordModule { }
