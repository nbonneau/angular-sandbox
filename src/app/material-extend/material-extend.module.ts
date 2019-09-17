import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialPopoverModule } from './popover/popover.module';
import { UtilModule } from './utils/util.module';
import { MaterialTimepickerModule } from './timepicker/timepicker.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialPopoverModule,
    MaterialTimepickerModule,
    UtilModule
  ],
  exports: [
    MaterialPopoverModule,
    MaterialTimepickerModule,
    UtilModule
  ]
})
export class MaterialExtendModule { }
