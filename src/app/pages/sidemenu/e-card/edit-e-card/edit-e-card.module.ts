import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; // Import IonicModule
import { EditECardPageRoutingModule } from './edit-e-card-routing.module';
import { EditECardPage } from './edit-e-card.page';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, // Ensure this is imported
    EditECardPageRoutingModule,
    RouterModule.forChild([{ path: '', component: EditECardPage }])
  ],
  declarations: [EditECardPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add CUSTOM_ELEMENTS_SCHEMA to support Web Components
})
export class EditECardPageModule {}
