// app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Import FormsModule

import { MapLocation } from './mapLocation.component';

@NgModule({
  declarations: [
    MapLocation,
    // Add other components here
  ],
  imports: [
    BrowserModule,
    FormsModule, // Add FormsModule to the imports array
    // Add other modules here
  ],
  providers: [],
  bootstrap: [MapLocation],
})
export class MapLocationModule {}
