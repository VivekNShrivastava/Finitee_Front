import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FreeUserCanvasOtherMenuModalPage } from './free-user-canvas-other-menu-modal.page';

const routes: Routes = [
  {
    path: '',
    component: FreeUserCanvasOtherMenuModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FreeUserCanvasOtherMenuModalPageRoutingModule {}
