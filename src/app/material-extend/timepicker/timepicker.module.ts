import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialTimepickerInputComponent } from './components/timepicker-input/timepicker-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DigitOnlyDirective } from './directives/digit-only.directive';
import { FocusoutZeroDirective } from './directives/focusout-zero.directive';
import { UpDownControlDirective } from './directives/up-down-control.directive';
import { FocusoutGroupDirective } from './directives/focusout-group.directive';
import { FocusoutItemDirective } from './directives/focusout-item.directive';
import { MaterialTimepickerRangeComponent } from './components/timepicker-range/timepicker-range.component';
import { MatFormFieldModule } from '@angular/material';

@NgModule({
   imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      MatFormFieldModule
   ],
   exports: [
      MaterialTimepickerInputComponent,
      MaterialTimepickerRangeComponent
   ],
   declarations: [
      MaterialTimepickerInputComponent,
      MaterialTimepickerRangeComponent,
      DigitOnlyDirective,
      FocusoutZeroDirective,
      FocusoutGroupDirective,
      FocusoutItemDirective,
      UpDownControlDirective,
   ],
   entryComponents: [

   ]
})
export class MaterialTimepickerModule { }
