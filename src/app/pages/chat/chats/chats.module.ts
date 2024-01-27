
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatsPage } from './chats.page';
import { AppNotificationIconComponent } from 'src/app/core/components/app-notification-icon/app-notification-icon.component';
import { LongPressDirective } from 'src/app/core/directives/long-press.directive';
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    AppNotificationIconComponent,
    LongPressDirective,
    RouterModule.forChild([{ path: '', component: ChatsPage }])
  ],
  declarations: [ChatsPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChatsPageModule { }