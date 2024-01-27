import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SonarPageRoutingModule } from './sonar-routing.module';

import { SonarPage } from './sonar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SonarPageRoutingModule
  ],
  declarations: [SonarPage]
})
export class SonarPageModule {}
