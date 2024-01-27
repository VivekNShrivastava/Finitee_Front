import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { ServiceRequiredListPage } from './service-required-list.page';

import { AppNotificationIconComponent } from 'src/app/core/components/app-notification-icon/app-notification-icon.component';
import { MultipleMediaUploadComponent } from 'src/app/core/components/mutiple-media-upload/mutiple-media-upload.component';
import { TraitsComponent } from 'src/app/core/components/traits/traits.component';
import { RouterModule } from '@angular/router';
import { SkeletonViewComponent } from 'src/app/core/components/skeleton-view/skeleton-view.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: ServiceRequiredListPage }]),
    AppNotificationIconComponent,
    MultipleMediaUploadComponent,
    TraitsComponent,
    SkeletonViewComponent
  ],
  declarations: [
    ServiceRequiredListPage,
  ],
})
export class ServiceRequiredListModule { }
