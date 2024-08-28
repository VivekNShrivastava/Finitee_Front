// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule, Routes } from '@angular/router';
// import { BusinessUserCanvasTestComponent } from './business-user-canvas-test.component';

// const routes: Routes = [
//   {
//     path: '',
//     component: BusinessUserCanvasTestComponent
//   }
// ];

// @NgModule({
//   declarations: [BusinessUserCanvasTestComponent],
//   imports: [
//     CommonModule,
//     RouterModule.forChild(routes) 
//   ]
// })
// export class BusinessUserCanvasTestModule { }
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BusinessUserCanvasTestComponent } from './business-user-canvas-test.component';
// import { AppNotificationIconModule } from '../path-to-app-notification-icon-module/app-notification-icon.module'; // Import the module with AppNotificationIconComponent
import { AppNotificationIconComponent } from 'src/app/core/components/app-notification-icon/app-notification-icon.component';

const routes: Routes = [
  {
    path: '',
    component: BusinessUserCanvasTestComponent
  }
];

@NgModule({
  declarations: [BusinessUserCanvasTestComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    AppNotificationIconComponent,

    // AppNotificationIconModule // Import here
  ]
})
export class BusinessUserCanvasTestModule { }
