import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ViewPostPage } from './view-post.page';
import { PostItemsComponent } from 'src/app/core/components/post/post-items/post-items.component';




@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    PostItemsComponent,
    RouterModule.forChild([{ path: '', component: ViewPostPage }]),
  ],
  declarations: [
    ViewPostPage
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ViewPostModule { }
