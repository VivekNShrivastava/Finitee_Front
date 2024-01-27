import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { LongPressDirective } from 'src/app/core/directives/long-press.directive';

@NgModule({
  declarations: [LongPressDirective],
  imports: [CommonModule],
  exports: [LongPressDirective],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentModule { }
