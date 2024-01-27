import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InflowsPage } from './inflows.page';

const routes: Routes = [
  {
    path: '',
    component: InflowsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InflowsPageRoutingModule {}
