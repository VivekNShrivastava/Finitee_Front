import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreviewPostTestPage } from './preview-post-test.page';

const routes: Routes = [
  {
    path: '',
    component: PreviewPostTestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreviewPostTestPageRoutingModule {}
