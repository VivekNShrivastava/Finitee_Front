import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BusinessOtherMenuModalPage } from './business-other-menu-modal.page';

const routes: Routes = [
  {
    path: '',
    component: BusinessOtherMenuModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusinessOtherMenuModalPageRoutingModule {}
