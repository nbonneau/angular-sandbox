import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialPopoverModule } from './popover/popover.module';
import { MaterialTimepickerModule } from './timepicker/timepicker.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialPopoverModule,
    MaterialTimepickerModule,
  ],
  exports: [
    MaterialPopoverModule,
    MaterialTimepickerModule,
  ]
})
export class MaterialExtendModule { }
