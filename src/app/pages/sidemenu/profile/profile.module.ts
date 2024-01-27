import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { AppNotificationIconComponent } from 'src/app/core/components/app-notification-icon/app-notification-icon.component';
// import { InviteToViewComponent } from '../../home/free-user-canvas/invite-to-view/invite-to-view.component';
// import { TraitSectionComponent } from '../../home/free-user-canvas/trait-section/trait-section.component';
import { profilePageRoutingModule } from './profile-routing.module';
import { profilePage } from './profile.page';
import { CustomFilterPipe } from 'src/app/core/pipes/filter';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppNotificationIconComponent,
    profilePageRoutingModule
  ],
  declarations: [
    profilePage,
    // TraitSectionComponent,
    // InviteToViewComponent,
  ],providers:[
    CustomFilterPipe
  ]
})
export class profilePageModule {}
