import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EditUsernameRoutingModule } from './edit-username-routing.module';
import { EditUsernameComponent } from './edit-username.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [EditUsernameComponent],
  imports: [
    CommonModule,
    EditUsernameRoutingModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: EditUsernameComponent }])

  ]
})
export class EditUsernameModule { }
