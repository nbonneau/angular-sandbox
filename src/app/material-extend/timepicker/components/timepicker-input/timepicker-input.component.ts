import { Component, OnDestroy, Input, ElementRef, Optional, Self, OnInit, HostListener, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, ControlValueAccessor, FormBuilder, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Subject } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';
import { filter } from 'rxjs/operators';

export class Time {
  static factory(str: string = ''): Time {
    const split = str.split(':');
    return new Time(split[0] || '', split[1] || '', split[2] || '');
  }
  get id(): string { return this.toNumber() + ''; }
  constructor(public hours: string, public minutes: string, public seconds: string) { }
  toString(): string {
    return (this.hours === undefined || this.hours === null ? '' : this.hours) + ':'
      + (this.minutes === undefined || this.minutes === null ? '' : this.minutes) + ':'
      + (this.seconds === undefined || this.seconds === null ? '' : this.seconds);
  }
  toNumber(): number { return Number((Number(this.hours) + '') + (Number(this.minutes) + '') + (Number(this.seconds) + '')); }
  // tslint:disable-next-line: max-line-length
  toJson(): { hours?: string; minutes?: string; seconds?: string; } { return { hours: this.hours, minutes: this.minutes, seconds: this.seconds }; }
  valid(): boolean { return this.hours.length === 2 && this.minutes.length === 2; }
  hasValues(): boolean {
    return (this.hours !== undefined && this.hours !== null && this.hours !== '')
      || (this.minutes !== undefined && this.minutes !== null && this.minutes !== '')
      || (this.seconds !== undefined && this.seconds !== null && this.seconds !== '');
  }
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'mat-timepicker-input',
  templateUrl: './timepicker-input.component.html',
  styleUrls: ['./timepicker-input.component.css'],
  providers: [{
    provide: MatFormFieldControl,
    useExisting: MaterialTimepickerInputComponent
  }],
  // tslint:disable-next-line: no-host-metadata-property
  // tslint:disable-next-line: use-host-property-decorator
  host: {
    '[class.timepicker-floating]': 'shouldLabelFloat',
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedBy',
  }
})
export class MaterialTimepickerInputComponent implements ControlValueAccessor, MatFormFieldControl<Time>, OnDestroy, OnInit {

  static nextId = 0;

  id = `app-timepicker-${MaterialTimepickerInputComponent.nextId++}`;
  errorState = false;
  controlType = 'app-timepicker';
  describedBy = '';
  focused = false;
  formGroup: FormGroup;
  stateChanges = new Subject<void>();

  private currentValue: Time;

  @Input() hours: string | number;
  @Input() maxHours: string | number = 23;
  @Input() minutes: string | number;
  @Input() maxMinutes: string | number = 59;
  @Input() seconds: string | number;
  @Input() maxSeconds: string | number = 59;

  @Output() changed: EventEmitter<Time> = new EventEmitter();
  @Output() focusIn: EventEmitter<void> = new EventEmitter();
  @Output() focusOut: EventEmitter<Time> = new EventEmitter();
  @Output() itemFocusIn: EventEmitter<string> = new EventEmitter();
  @Output() itemFocusOut: EventEmitter<string> = new EventEmitter();

  get empty() {
    const { value: { hours, minutes, seconds } } = this.formGroup;
    return !hours && !minutes && !seconds;
  }

  get shouldLabelFloat() { return this.focused || !this.empty; }

  get popoverData() {
    return {
      maxHours: this.maxHours,
      maxMinutes: this.maxMinutes,
      maxSeconds: this.maxSeconds,
      form: this.formGroup,
      hasSeconds: this.hasSeconds()
    };
  }

  @Input()
  get placeholder(): string { return this._placeholder; }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  // tslint:disable-next-line: variable-name
  private _placeholder: string;

  @Input()
  get required(): boolean { return this._required; }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  // tslint:disable-next-line: variable-name
  private _required = false;

  @Input()
  get disabled(): boolean { return this._disabled; }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this.formGroup.disable() : this.formGroup.enable();
    this.stateChanges.next();
  }
  // tslint:disable-next-line: variable-name
  private _disabled = false;

  @Input()
  get value(): Time | null {
    const { value: { hours, minutes, seconds } } = this.formGroup;
    if (hours.length === 2 && minutes.length === 2) {
      return new Time(hours, minutes, seconds);
    }
    return null;
  }
  set value(time: Time | null) {
    const { hours, minutes, seconds } = time || new Time('', '', '');
    this.formGroup.setValue({ hours, minutes, seconds });
    this.stateChanges.next();
  }

  constructor(
    private formBuilder: FormBuilder,
    // tslint:disable-next-line: variable-name
    private _focusMonitor: FocusMonitor,
    // tslint:disable-next-line: variable-name
    private _elementRef: ElementRef<HTMLElement>,
    @Optional() @Self() public ngControl: NgControl) {

    _focusMonitor.monitor(_elementRef, true).subscribe(origin => {
      if (this.focused && !origin) {
        this.onTouched();
      }
      this.focused = !!origin;
      this.stateChanges.next();
    });

    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  onFocusin(event) {
    this.focusIn.emit(event);
  }

  onFocusout() {
    const { value: { hours, minutes, seconds } } = this.formGroup;
    const time = new Time(hours, minutes, seconds);
    if (time.toString() !== this.currentValue.toString()) {
      if (time.hasValues() && !this.formGroup.get('hours').value) {
        this.formGroup.get('hours').setValue('00');
        time.hours = '00';
      }
      if (time.hasValues() && !this.formGroup.get('minutes').value) {
        this.formGroup.get('minutes').setValue('00');
        time.hours = '00';
      }
      if (time.hasValues() && this.hasSeconds() && !this.formGroup.get('seconds').value) {
        this.formGroup.get('seconds').setValue('00');
        time.hours = '00';
      }
      this.currentValue = time;
      this.changed.emit(time);
    }
    this.focusOut.emit(time);
  }

  onItemFocusin(key: string) {
    this.itemFocusIn.emit(key);
  }

  onItemFocusout(key: string) {
    this.itemFocusOut.emit(key);
  }

  ngOnInit() {

    this.formGroup = this.formBuilder.group({});

    this.formGroup.addControl('hours', new FormControl(this.addZeroBefore(this.hours)));
    this.formGroup.get('hours').valueChanges
      .pipe(filter(value => Number(value) > Number(this.maxHours)))
      .subscribe(() => this.formGroup.get('hours').setValue(this.maxHours));
    this.formGroup.get('hours').valueChanges
      .pipe(filter(value => Number(value) === -1))
      .subscribe(() => this.formGroup.get('hours').setValue(this.maxHours));

    this.formGroup.addControl('minutes', new FormControl(this.addZeroBefore(this.minutes)));
    this.formGroup.get('minutes').valueChanges
      .pipe(filter(value => Number(value) > Number(this.maxMinutes)))
      .subscribe(() => {
        if (this.incrementValue(this.formGroup.get('hours').value) > Number(this.maxHours)) {
          this.formGroup.get('hours').setValue('00');
        } else {
          this.formGroup.get('hours').setValue(this.incrementValue(this.formGroup.get('hours').value));
        }
        this.formGroup.get('minutes').setValue(this.maxMinutes);
      });
    this.formGroup.get('minutes').valueChanges
      .pipe(filter(value => Number(value) === -1))
      .subscribe(() => {
        this.formGroup.get('hours').setValue(this.decrementValue(this.formGroup.get('hours').value));
        this.formGroup.get('minutes').setValue(this.maxMinutes);
      });

    if (this.hasSeconds()) {
      this.formGroup.addControl('seconds', new FormControl(this.addZeroBefore(this.seconds)));
      this.formGroup.get('seconds').valueChanges
        .pipe(filter(value => Number(value) > Number(this.maxSeconds)))
        .subscribe(() => {
          const val = this.incrementValue(this.formGroup.get('minutes').value);
          this.formGroup.get('minutes').setValue(this.incrementValue(this.formGroup.get('minutes').value));
          if (val > Number(this.maxSeconds)) {
            this.formGroup.get('minutes').setValue('00');
          }
          this.formGroup.get('seconds').setValue(this.maxSeconds);
        });
      this.formGroup.get('seconds').valueChanges
        .pipe(filter(value => Number(value) === -1))
        .subscribe(() => {
          this.formGroup.get('minutes').setValue(this.decrementValue(this.formGroup.get('minutes').value));
          this.formGroup.get('seconds').setValue(this.maxSeconds);
        });
    }

    const { value: { hours, minutes, seconds } } = this.formGroup;
    this.currentValue = new Time(hours, minutes, seconds);
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(time: Time | null): void {
    this.value = time;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() !== 'input' && this._elementRef.nativeElement.querySelector('input')) {
      this._elementRef.nativeElement.querySelector('input').focus();
    }
  }

  _handleInput(): void {
    this.onChange(this.formGroup.value);
  }

  onChange = (_: any) => { };

  onTouched = () => { };

  private hasSeconds(): boolean {
    return this.seconds !== undefined && this.seconds !== null;
  }

  private incrementValue(value: string | number): string | number {
    return this.addZeroBefore((Number(value) || 0) + 1);
  }

  private decrementValue(value: string | number): string | number {
    return this.addZeroBefore((Number(value) || 0) - 1);
  }

  private addZeroBefore(value: string | number): string {
    return (value !== undefined && value !== null ? (Number(value) < 10 && Number(value) !== -1 ? '0' + value : value) : '') + '';
  }

}
