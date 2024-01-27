import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InviteToViewComponent } from '../../home/free-user-canvas/invite-to-view/invite-to-view.component';
import { TraitSectionComponent } from '../../home/free-user-canvas/trait-section/trait-section.component';
import { profilePage } from './profile.page';


const routes: Routes = [
  {
    path: '',
    component: profilePage,
  },
  {
    path: 'trait-section',
    component: TraitSectionComponent,
  },
  {
    path: 'invite-to-view',
    component: InviteToViewComponent,
  } 
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class profilePageRoutingModule { }
