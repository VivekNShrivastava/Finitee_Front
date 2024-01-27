import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NonprofitDonationIndividualOtherPageRoutingModule } from './nonprofit-donation-individual-other-routing.module';

import { NonprofitDonationIndividualOtherPage } from './nonprofit-donation-individual-other.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NonprofitDonationIndividualOtherPageRoutingModule
  ],
  declarations: [NonprofitDonationIndividualOtherPage]
})
export class NonprofitDonationIndividualOtherPageModule {}
