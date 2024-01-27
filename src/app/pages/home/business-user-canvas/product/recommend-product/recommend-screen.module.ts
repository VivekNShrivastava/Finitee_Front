import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { RecommendScreenPage } from './recommend-screen.page';
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: RecommendScreenPage }]),
  ],
  declarations: [
    RecommendScreenPage
  ],
})
export class RecommendProductModule { }