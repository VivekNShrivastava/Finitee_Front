import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllUsersPage } from './all-users.page';

const routes: Routes = [
  {
    path: '',
    component: AllUsersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllUsersPageRoutingModule {}
