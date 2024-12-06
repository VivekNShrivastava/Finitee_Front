import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AllUsersPageRoutingModule } from './all-users-routing.module';
import { AllUsersPage } from './all-users.page';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllUsersPageRoutingModule,
    RouterModule.forChild([{ path: '', component: AllUsersPage }])

  ],
  declarations: [AllUsersPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class AllUsersPageModule {}

export { AllUsersPage };
