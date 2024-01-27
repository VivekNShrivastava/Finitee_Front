import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommunityGuidelinesRoutingModule } from './community-guidelines-routing.module';

import { CommunityGuidelinesComponent } from './community-guidelines.component';

@NgModule({
  
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommunityGuidelinesRoutingModule
  ],
  declarations: [CommunityGuidelinesComponent]
})
export class CommunityGuidelinesModule { }
