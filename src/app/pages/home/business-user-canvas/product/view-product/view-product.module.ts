import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';




import { RouterModule } from '@angular/router';
import { SkeletonViewComponent } from 'src/app/core/components/skeleton-view/skeleton-view.component';
import { ViewProductPage } from './view-product.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: ViewProductPage }]),
    SkeletonViewComponent
  ],
  declarations: [
    ViewProductPage,
  ],
})
export class ViewProductModule { }