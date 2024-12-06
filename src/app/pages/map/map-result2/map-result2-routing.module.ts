import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapResult2Page } from './map-result2.page';

const routes: Routes = [
  {
    path: '',
    component: MapResult2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapResult2PageRoutingModule {}
