import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MediaViewerPage } from './media-viewer.page';

const routes: Routes = [
  {
    path: '',
    component: MediaViewerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MediaViewerPageRoutingModule {}
