import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapResult2PageRoutingModule } from './map-result2-routing.module';

import { MapResult2Page } from './map-result2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapResult2PageRoutingModule
  ],
  declarations: [MapResult2Page],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 

})
export class MapResult2PageModule {}
