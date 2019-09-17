import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appFocusoutZero]'
})
export class FocusoutZeroDirective {

  constructor(private el: ElementRef) { }

  @HostListener('focusout')
  onFocusOut() {
    if (this.el.nativeElement.value === '') {
      return;
    }
    if (Number(this.el.nativeElement.value) < 10 && this.el.nativeElement.value.length < 2) {
      this.el.nativeElement.value = '0' + this.el.nativeElement.value;
    }
  }
}
