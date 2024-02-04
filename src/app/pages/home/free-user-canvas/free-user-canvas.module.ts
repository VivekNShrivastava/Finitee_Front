import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FreeUserCanvasPageRoutingModule } from './free-user-canvas-routing.module';

import { AppNotificationIconComponent } from 'src/app/core/components/app-notification-icon/app-notification-icon.component';
import { FreeUserCanvasPage } from './free-user-canvas.page';
import { InviteToViewComponent } from './invite-to-view/invite-to-view.component';
import { TraitSectionComponent } from './trait-section/trait-section.component';
import { EditPersonalPage } from './edit-personal/edit-personal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppNotificationIconComponent,
    FreeUserCanvasPageRoutingModule,
  ],
  declarations: [
    FreeUserCanvasPage,
    TraitSectionComponent,
    InviteToViewComponent,
    EditPersonalPage
  ],
})
export class FreeUserCanvasPageModule {}
