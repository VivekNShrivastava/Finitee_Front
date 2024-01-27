import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateEditShoppingListPage } from './create-edit-shopping-list.page';

const routes: Routes = [
  {
    path: '',
    component: CreateEditShoppingListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateEditShoppingListPageRoutingModule {}
