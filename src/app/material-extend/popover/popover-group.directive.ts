import { Directive, Input, Output, EventEmitter } from '@angular/core';
import { PopoverDirective } from './popover.directive';

@Directive({
  selector: '[matPopoverGroup]'
})
export class PopoverGroupDirective {

  clickedPopover: PopoverDirective = null;
  clickedPopoverIndex: number = null;
  popoverCount: number = 0;

  _grouped: boolean = true;
  _popoverKeepHideDelay: boolean = false;
  _popoverAlwaysShow: boolean = false;

  @Input('matPopoverKeepHideDelay')
  get popoverKeepHideDelay(): boolean { return this._popoverKeepHideDelay; }
  set popoverKeepHideDelay(value: boolean) {
    this._popoverKeepHideDelay = true;
  }

  @Input('matPopoverAlwaysShow')
  get popoverAlwaysShow(): boolean { return this._popoverAlwaysShow; }
  set popoverAlwaysShow(value: boolean) {
    this._popoverAlwaysShow = true;
  }

  @Input('matPopoverGroup')
  get grouped(): boolean { return this._grouped; }
  set grouped(value: boolean) {
    this._grouped = value == undefined || value === null || (value as any) === '' ? true : value;
  }

  @Output('popoverReset') popoverReset: EventEmitter<void> = new EventEmitter();
  @Output('popoverSwitch') popoverSwitch: EventEmitter<any> = new EventEmitter();

  constructor() { }

  reset(): void {
    this.hideClickedPopover(this.clickedPopover ? this.clickedPopover.hideDelay : 0);
    this.clickedPopover = null;
    this.clickedPopoverIndex = null;
    this.popoverReset.emit();
  }

  hasClickedPopover(): boolean {
    return !!this.clickedPopover;
  }

  hideClickedPopover(delay?: number, index?: number): boolean {
    if (this.clickedPopover && this.clickedPopoverIndex !== index) {
      if (this.clickedPopover._tooltipInstance) {
        const clicked = this.clickedPopover._tooltipInstance.clicked;
        this.clickedPopover._tooltipInstance.clicked = false;
        if (clicked) {
          this.clickedPopover.popoverClicked.emit(this.clickedPopover._tooltipInstance.clicked);
        }
      }
      this.clickedPopover.hide(delay);
      return true;
    }
    return false;
  }

  setClickedPopover(popoverDirective: PopoverDirective, index: number): void {

    const i = this.clickedPopoverIndex;

    const hidePopover = this.hideClickedPopover(this._popoverKeepHideDelay ? (this.clickedPopover ? this.clickedPopover.hideDelay : 0) : 0, index);

    this.clickedPopover = null;
    this.clickedPopoverIndex = null;

    if (i !== index) {

      popoverDirective.show(0);

      if (hidePopover && this.grouped) {
        this.popoverSwitch.emit({
          from: i,
          to: index
        });
      }

      this.clickedPopover = popoverDirective;
      this.clickedPopoverIndex = index;
    }
  }

}
