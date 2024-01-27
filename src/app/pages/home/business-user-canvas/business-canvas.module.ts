import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BusinessCanvasPage } from './business-canvas.page';
import { AppNotificationIconComponent } from 'src/app/core/components/app-notification-icon/app-notification-icon.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppNotificationIconComponent,
    RouterModule.forChild([{ path: '', component: BusinessCanvasPage }])
  ],
  declarations: [
    BusinessCanvasPage
  ],
})
export class BusinessCanvasPageModule {}
