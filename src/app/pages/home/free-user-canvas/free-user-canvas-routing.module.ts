import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FreeUserCanvasPage } from './free-user-canvas.page';
import { InviteToViewComponent } from './invite-to-view/invite-to-view.component';
import { TraitSectionComponent } from './trait-section/trait-section.component';
// import { NewTraitPageModule } from './new-trait-page/new-trait-page.module';

const routes: Routes = [
  {
    path: '',
    component: FreeUserCanvasPage,
  },
  {
    path: 'trait-section',
    component: TraitSectionComponent,
  },
  {
    path: 'invite-to-view',
    component: InviteToViewComponent,
  },
  // {
  //   path: 'new-trait-section',
  //   component: NewTraitPageModule,
  // },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FreeUserCanvasPageRoutingModule { }
