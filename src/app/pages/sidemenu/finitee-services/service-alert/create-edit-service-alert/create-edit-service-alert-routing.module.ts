import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateEditServiceAlertPage } from './create-edit-service-alert.page';

const routes: Routes = [
  {
    path: '',
    component: CreateEditServiceAlertPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateEditServiceAlertPageRoutingModule {}
