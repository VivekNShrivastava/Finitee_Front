import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditeducationPage } from './edit-education.page';
import { RouterModule } from '@angular/router';
import { TraitsComponent } from 'src/app/core/components/traits/traits.component';
import { SelectSearchableComponent } from 'src/app/core/components/select-searchable/select-searchable.component';

@NgModule({
  imports: [   FormsModule,
    ReactiveFormsModule,
    CommonModule, FormsModule, IonicModule, TraitsComponent, SelectSearchableComponent, RouterModule.forChild([{ path: '', component: EditeducationPage }]),],
  declarations: [EditeducationPage],
})
export class EditeducationModule { }
