import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopoverDirective } from './popover.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule } from '@angular/material';
import { PopoverComponent } from './popover.component';
import { PopoverGroupDirective } from './popover-group.directive';

@NgModule({
   imports: [
      CommonModule,
      BrowserAnimationsModule,
      MatTooltipModule
   ],
   exports: [
      PopoverDirective,
      PopoverComponent,
      PopoverGroupDirective
   ],
   declarations: [
      PopoverDirective,
      PopoverComponent,
      PopoverGroupDirective
   ],
   entryComponents: [
      PopoverComponent
   ]
})
export class MaterialPopoverModule { }
