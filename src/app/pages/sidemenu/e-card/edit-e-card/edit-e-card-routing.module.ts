import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditECardPage } from './edit-e-card.page';

const routes: Routes = [
  {
    path: '',
    component: EditECardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditECardPageRoutingModule {}
