import { Directive, Optional, Inject, HostListener, ElementRef, Output, EventEmitter } from '@angular/core';
import { FocusoutGroupDirective } from './focusout-group.directive';

@Directive({
  selector: '[appFocusoutItem]'
})
export class FocusoutItemDirective {

  @Output() focusIn: EventEmitter<string> = new EventEmitter();
  @Output() focusOut: EventEmitter<string> = new EventEmitter();

  constructor(
    private el: ElementRef,
    @Optional() @Inject(FocusoutGroupDirective) protected focusoutGroupDirective: FocusoutGroupDirective
  ) { }

  @HostListener('focusin', ['$event'])
  onFocusin(event) {
    const name = event.target.attributes.getNamedItem('ng-reflect-name').value;
    this.focusoutGroupDirective.focusedItem = name;
    this.focusoutGroupDirective.focus(name);
    this.focusIn.emit(name);
  }

  @HostListener('focusout', ['$event'])
  onFocusout(event) {
    setTimeout(() => {
      const name = event.target.attributes.getNamedItem('ng-reflect-name').value;
      if (this.focusoutGroupDirective.focusedItem === name) {
        this.focusoutGroupDirective.exit(name);
      }
      this.focusOut.emit(name);
    }, 50);
  }

  @HostListener('keyup', ['$event'])
  onEnterKeyUp(event) {
    if (event.code === 'Enter') {
      const name = event.target.attributes.getNamedItem('ng-reflect-name').value;
      this.focusoutGroupDirective.exit(name);
      this.focusOut.emit(name);
      this.el.nativeElement.blur();
      event.preventDefault();
      event.stopPropagation();
    }
  }

}
