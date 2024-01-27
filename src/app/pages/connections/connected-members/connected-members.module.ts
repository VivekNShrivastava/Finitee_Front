import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TraitsComponent } from 'src/app/core/components/traits/traits.component';
import { ConnectedMembersPage } from './connected-members.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, TraitsComponent, RouterModule.forChild([{ path: '', component: ConnectedMembersPage }]),],
  declarations: [ConnectedMembersPage],
})
export class ConnectedMembersModule { }
