import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EditNameRoutingModule } from './edit-name-routing.module';
import { EditNameComponent } from './edit-name.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [EditNameComponent],
  imports: [
    CommonModule,
    EditNameRoutingModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: EditNameComponent }])
  ]
})
export class EditNameModule { }
