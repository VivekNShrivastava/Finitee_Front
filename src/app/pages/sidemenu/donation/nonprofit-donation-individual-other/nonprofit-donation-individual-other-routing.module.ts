import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NonprofitDonationIndividualOtherPage } from './nonprofit-donation-individual-other.page';

const routes: Routes = [
  {
    path: '',
    component: NonprofitDonationIndividualOtherPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NonprofitDonationIndividualOtherPageRoutingModule {}
