import { Directive, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appFocusoutGroup]'
})
export class FocusoutGroupDirective {

  focusedItem: any = null;

  @Output() leave: EventEmitter<string> = new EventEmitter();
  @Output() enter: EventEmitter<string> = new EventEmitter();

  constructor() { }

  exit(name: string): void {
    this.focusedItem = null;
    this.leave.emit(name);
  }

  focus(name: string): void {
    this.enter.emit(name);
  }
}
