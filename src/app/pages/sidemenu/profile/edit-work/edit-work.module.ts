import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { FormsModule } from '@angular/forms';
import { EditworkPage } from './edit-work.page';
import { RouterModule } from '@angular/router';
import { TraitsComponent } from 'src/app/core/components/traits/traits.component';
import { SelectSearchableComponent } from 'src/app/core/components/select-searchable/select-searchable.component';

@NgModule({
  imports: [
    CommonModule, FormsModule, IonicModule, TraitsComponent, SelectSearchableComponent, RouterModule.forChild([{ path: '', component: EditworkPage }]),],
  declarations: [EditworkPage],
})
export class EditworkModule { }
