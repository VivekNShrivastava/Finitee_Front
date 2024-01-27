import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatDetailPage } from './chat-detail.page';
import { ChatDetailComponent } from '../component/chat-detail/chat-detail.component';
const routes: Routes = [
  {
    path: '',
    component: ChatDetailPage
  }
];
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ChatDetailComponent,
    RouterModule.forChild(routes)
  ],
  declarations: [ChatDetailPage],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ChatDetailPageModule {}


