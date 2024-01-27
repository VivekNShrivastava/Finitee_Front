import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiceAlertMatchesListPageRoutingModule } from './service-alert-matches-list-routing.module';

import { ServiceAlertMatchesListPage } from './service-alert-matches-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiceAlertMatchesListPageRoutingModule
  ],
  declarations: [ServiceAlertMatchesListPage]
})
export class ServiceAlertMatchesListPageModule {}
