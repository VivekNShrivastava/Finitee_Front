import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HelpPage } from './help.page';
import { AppinfoComponent } from './appinfo/appinfo.component';
import { FaqsComponent } from './faqs/faqs.component';
import { LegalComponent } from './legal/legal.component';
import { TutorialsComponent } from './tutorials/tutorials.component';
import { ReportComponent } from './report/report.component';
import { ReportModule } from './report/report.module';

const routes: Routes = [
  {
    path: '',
    component: HelpPage,
  },
  {
    path: 'appinfo',
    component: AppinfoComponent,
  },
  {
    path: 'faqs',
    component: FaqsComponent,
  },
  {
    path: 'legal',
    component: LegalComponent,
  },
  {
    path: 'tutorials',
    component: TutorialsComponent,
  },
  {
    path: 'report',
    component: ReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpPageRoutingModule {}
