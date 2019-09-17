import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StickyDirective, StickyViewportDirective } from './sticky';
import { ScrollVisibleDirective, ScrollVisibleViewportDirective } from './scroll-visible';

@NgModule({
   imports: [
      CommonModule
   ],
   exports: [
      StickyDirective,
      ScrollVisibleDirective,
      ScrollVisibleViewportDirective,
      StickyViewportDirective
   ],
   declarations: [
      StickyDirective,
      ScrollVisibleDirective,
      ScrollVisibleDirective,
      ScrollVisibleViewportDirective,
      StickyViewportDirective
   ],
   entryComponents: [

   ]
})
export class UtilModule { }
