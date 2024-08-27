import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddPostTestPage } from './add-post-test.page';

const routes: Routes = [
  {
    path: '',
    component: AddPostTestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddPostTestPageRoutingModule {}
