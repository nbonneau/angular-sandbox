import { Component, Input, Output, EventEmitter, OnInit, ContentChild, TemplateRef } from '@angular/core';
import { MatFormFieldControl } from '@angular/material';
import { Time } from '../timepicker-input/timepicker-input.component';
import { Subject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

export class TimeRange {
  static factory(str: string = ''): TimeRange {
    const split = str.split('-');
    return new TimeRange(Time.factory(split[0] || ''), Time.factory(split[1] || ''));
  }
  get id(): string { return this.toNumber() + ''; }
  constructor(public from: Time, public to: Time) { }
  toString(): string { return this.from.toString() + '-' + this.to.toString(); }
  toNumber(): number { return Number(this.from.toNumber() + '' + this.to.toNumber()); }
  toJson(): any { return { from: this.from.toJson(), to: this.to.toJson() }; }
  valid(): boolean { return this.from.valid() && this.to.valid(); }
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'mat-timepicker-range',
  templateUrl: './timepicker-range.component.html',
  styleUrls: ['./timepicker-range.component.css'],
  providers: [{
    provide: MatFormFieldControl,
    useExisting: MaterialTimepickerRangeComponent
  }],
  // tslint:disable-next-line: no-host-metadata-property
  // tslint:disable-next-line: use-host-property-decorator
  host: {
    '[class.timepicker-floating]': 'shouldLabelFloat',
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedBy',
  }
})
export class MaterialTimepickerRangeComponent implements OnInit {

  private currentValue: TimeRange;
  private currentFocusedItem: string;
  private currentFocusedTimepicker: string;
  private subject: Subject<string> = new Subject();

  // tslint:disable-next-line: max-line-length
  @Input() from: { hours?: string | number; minutes?: string | number; seconds?: string | number; placeholder: string; } = { placeholder: 'From' };
  // tslint:disable-next-line: max-line-length
  @Input() to: { hours?: string | number; minutes?: string | number; seconds?: string | number; placeholder: string; } = { placeholder: 'To' };
  @Input() maxHours: string | number = 23;
  @Input() maxMinutes: string | number = 59;
  @Input() maxSeconds: string | number = 59;
  @Input() formFieldClass: string;

  @Output() changed: EventEmitter<TimeRange> = new EventEmitter();

  @ContentChild('timepickerFrom') timepickerFrom: TemplateRef<any>;
  @ContentChild('timepickerTo') timepickerTo: TemplateRef<any>;

  ngOnInit() {
    this.currentValue = new TimeRange(
      new Time(
        (this.from.hours !== undefined && this.from.hours !== null ? this.from.hours : '') + '',
        (this.from.minutes !== undefined && this.from.minutes !== null ? this.from.minutes : '') + '',
        (this.from.seconds !== undefined && this.from.seconds !== null ? this.from.seconds : '') + ''
      ),
      new Time(
        (this.to.hours !== undefined && this.to.hours !== null ? this.to.hours : '') + '',
        (this.to.minutes !== undefined && this.to.minutes !== null ? this.to.minutes : '') + '',
        (this.to.seconds !== undefined && this.to.seconds !== null ? this.to.seconds : '') + ''
      )
    );

    let firstEmit = true;
    this.subject
      .pipe(distinctUntilChanged(), map(TimeRange.factory))
      .subscribe((range) => {
        if (!firstEmit) {
          this.changed.emit(range);
        }
        firstEmit = false;
      });

    this.subject.next(this.currentValue.toString());
  }

  timepickerFocusout(key: string, time: Time): void {

    const currentValue = this.currentValue[key];

    if (currentValue.toString() !== time.toString()) {
      this.currentValue[key] = time;
    }
  }

  timepickerFocusin(key: string): void {
    this.currentFocusedTimepicker = key;
  }

  itemFocusOut(keyA: string, keyB: string): void {
    if (this.currentFocusedItem === keyB && this.currentFocusedTimepicker === keyA) {
      this.currentFocusedItem = null;
      this.currentFocusedTimepicker = null;
      this.subject.next(this.currentValue.toString());
    }
  }

  itemFocusIn(key: string): void {
    this.currentFocusedItem = key;
  }

}
