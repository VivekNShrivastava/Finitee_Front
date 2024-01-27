import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServiceAlertMatchesListPage } from './service-alert-matches-list.page';

const routes: Routes = [
  {
    path: '',
    component: ServiceAlertMatchesListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceAlertMatchesListPageRoutingModule {}
