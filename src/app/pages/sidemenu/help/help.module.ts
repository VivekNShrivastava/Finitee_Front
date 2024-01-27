import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HelpPageRoutingModule } from './help-routing.module';

import { HelpPage } from './help.page';
import { AppinfoComponent } from './appinfo/appinfo.component';
import { FaqsComponent } from './faqs/faqs.component';
import { LegalComponent } from './legal/legal.component';
import { TutorialsComponent } from './tutorials/tutorials.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, HelpPageRoutingModule],
  declarations: [
    HelpPage,
    AppinfoComponent,
    FaqsComponent,
    LegalComponent,
    TutorialsComponent,
  ],
})
export class HelpPageModule {}
