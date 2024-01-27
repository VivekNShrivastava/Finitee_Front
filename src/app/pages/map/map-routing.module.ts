import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapPage } from './map.page';
import { TotemDetailsComponent } from './totem/create-totem/totem-details.component';

const routes: Routes = [
  {
    path: '',
    component: MapPage
  },
  {
    path: 'create-totem',
    component:TotemDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapPageRoutingModule {}
