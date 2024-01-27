import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShoppingWordsmatchesListPage } from './shopping-wordsmatches-list.page';

const routes: Routes = [
  {
    path: '',
    component: ShoppingWordsmatchesListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShoppingWordsmatchesListPageRoutingModule {}
