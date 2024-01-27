import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BusinessProductModalPage } from './business-product-modal.page';


const routes: Routes = [
  {
    path: '',
    component: BusinessProductModalPage

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class BusinessProductModalPageRoutingModule {}

