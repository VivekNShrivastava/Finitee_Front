import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DonationPage } from './donation.page';
//import { CreateDonationRequestComponent } from './create-donation-request/create-donation-request.component';
//import { ConfirmDonationComponent } from './confirm-donation/confirm-donation.component';

const routes: Routes = [
  {
    path: '',
    component: DonationPage,
  },
/*   {
    path: 'create-donation-request',
    component: CreateDonationRequestComponent,
  }, */
/*   {
    path: 'confirm-donation',
    component: ConfirmDonationComponent,
  }, */
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DonationPageRoutingModule {}
