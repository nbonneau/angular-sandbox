import { Directive, EventEmitter, Output, HostListener, ElementRef, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Directive({
  selector: '[appUpDownControl]'
})
export class UpDownControlDirective {

  timeout: any;

  @Output() up: EventEmitter<void> = new EventEmitter();
  @Output() down: EventEmitter<void> = new EventEmitter();

  private control: FormControl;
  private maxValue: number;

  @Input('appUpDownControl')
  set appUpDownControl(control: FormControl) {
    if (!control) {
      throw new Error('Directive "appUpDownControl" require a FormControl value');
    }
    this.control = control;
  }

  @Input('appUpDownControlMax')
  set appUpDownControlMax(max: number) {
    this.maxValue = max;
  }

  constructor(private el: ElementRef) { }

  @HostListener('keyup', ['$event'])
  onKeyup(event: KeyboardEvent) {
    clearTimeout(this.timeout);
    this.timeout = null;
    if (event.code === 'ArrowUp') {
      const val = Number(this.control.value) + 1;
      this.control.setValue(this.addZeroBefore(val));
      if (this.maxValue !== undefined && this.maxValue !== null && val > this.maxValue) {
        this.control.setValue('00');
      }
    }
    if (event.code === 'ArrowDown') {
      const val = Number(this.control.value) - 1;
      this.control.setValue(this.addZeroBefore(val));
      if (val === -1) {
        this.control.setValue(this.addZeroBefore(this.maxValue || '0'));
      }
    }
  }


  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    const isDown = !!this.timeout;
    this.timeout = setTimeout(() => {
      clearTimeout(this.timeout);
      if (event.code === 'ArrowUp') {
        const val = Number(this.control.value) + 1;
        this.control.setValue(this.addZeroBefore(val));
        if (this.maxValue !== undefined && this.maxValue !== null && val > this.maxValue) {
          this.control.setValue('00');
        }
      }
      if (event.code === 'ArrowDown') {
        const val = Number(this.control.value) - 1;
        this.control.setValue(this.addZeroBefore(val));
        if (val === -1) {
          this.control.setValue(this.addZeroBefore(this.maxValue || '0'));
        }
      }
    }, isDown ? 0 : 1000);
  }

  private addZeroBefore(value: string | number): string {
    return (value !== undefined && value !== null ? (Number(value) < 10 && Number(value) !== -1 ? '0' + value : value) : '') + '';
  }
}
