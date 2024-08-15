import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapPageRoutingModule } from './map-routing.module';

import { MapPage } from './map.page';
import { MapService } from './services/map.service';
import { MarkerInfoComponent } from './marker-info/marker-info.component';
import { MapSearchComponent } from './map-search/map-search.component';
import { TotemDetailsComponent } from './totem/create-totem/totem-details.component';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { AttachmentHelperService } from 'src/app/core/services/attachment-helper.service';
import { ViewingUsersComponent } from './viewing-users/viewing-users.component';
import { GreetingViewComponent } from './greeting-view/greeting-view.component';
import { SonarSettingsComponent } from './sonar-settings/sonar-settings.component';
import { MapResultComponent } from './map-result/map-result.component';
import { MarkerDetailComponent } from './marker-detail/marker-detail.component';
import { Network } from '@capacitor/network';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapPageRoutingModule
  ],
  declarations: [
    MapPage,
    MarkerInfoComponent,
    MapSearchComponent,
    TotemDetailsComponent,
    ViewingUsersComponent,
    GreetingViewComponent,
    SonarSettingsComponent,
    MapResultComponent,
    MarkerDetailComponent
  ],
  providers: [
    MapService,
    AttachmentHelperService,
    // Diagnostic,
    Camera,
    { provide: 'NetworkPlugin', useValue: Network }
  ]
})
export class MapPageModule {}
