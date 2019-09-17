import { Directive, Input, Inject, Optional, ElementRef, ViewContainerRef, NgZone, Injector, HostListener, Output, EventEmitter, OnInit } from '@angular/core';

import { MatTooltip, MAT_TOOLTIP_SCROLL_STRATEGY, MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions, TooltipPosition } from '@angular/material';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';

import { takeUntil } from 'rxjs/operators';
import { MaterialPopoverComponent, PopoverData, POPOVER_DATA } from './popover.component';
import { Overlay, ScrollDispatcher, OverlayRef } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { AriaDescriber, FocusMonitor } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { PopoverGroupDirective } from './popover-group.directive';

@Directive({
  selector: '[matPopover]',
  host: {
    '(longpress)': 'show()',
    '(keydown)': '_handleKeydown($event)',
    '(touchend)': '_handleTouchend()',
  }
})
export class PopoverDirective extends MatTooltip implements OnInit {

  hovered: boolean;
  index: number;

  _overlayRef: OverlayRef;
  _tooltipInstance: MaterialPopoverComponent;

  protected _disabledHover: boolean;
  protected _component: any;
  protected _margin: string;
  protected _sourceClickable: boolean = false;
  protected _targetClickable: boolean = false;
  protected _config: PopoverData = { sourceClickable: false, targetClickable: false, data: {}, margin: '' } as any;
  protected _data: any;

  @Input('matPopoverShowDelay') showDelay = (<any>this)._defaultOptions.showDelay;
  @Input('matPopoverHideDelay') hideDelay = (<any>this)._defaultOptions.hideDelay;

  @Input('matPopoverClass')
  get popoverClass() { return this.tooltipClass; }
  set popoverClass(value: string | string[] | Set<string> | { [key: string]: any }) {
    this.tooltipClass = value;
  }

  @Input('matPopoverPosition')
  get positionPopover(): TooltipPosition { return this.position; }
  set positionPopover(value: TooltipPosition) {
    this.position = value;
  }

  @Input('matPopoverDisabled')
  get disabledPopover(): boolean { return this.disabled; }
  set disabledPopover(value) {
    this.disabled = value;
  }

  @Input('matPopoverDisableHover')
  get disabledHover(): any { return this._disabledHover; }
  set disabledHover(value: any) {
    this._disabledHover = value === undefined || value === null || value === '' ? true : value;
  }

  @Input('matPopoverData')
  get data(): any { return this._data; }
  set data(value: any) {

    const before = this.data;

    this._data = value;

    if (!this._config) {
      this._config = {} as any;
    }

    this._config.data = this._data;
    this._refreshView();
    if (this._isTooltipVisible()) {
      this.popoverChanged.emit({ after: this._config.data, before });
    }
  }

  @Input('matPopoverSourceClickable')
  get sourceClickable(): any { return this._sourceClickable; }
  set sourceClickable(value: any) {
    this._sourceClickable = value === undefined || value === null || value === '' ? true : value;
    if (!this._config) {
      this._config = {} as any;
    }
    this._config.sourceClickable = this._sourceClickable;
    this._refreshView();
  }

  @Input('matPopoverTargetClickable')
  get targetClickable(): any { return this._targetClickable; }
  set targetClickable(value: any) {
    this._targetClickable = value === undefined || value === null || value === '' ? true : value;
    if (!this._config) {
      this._config = {} as any;
    }
    this._config.targetClickable = this._targetClickable;
    this._refreshView();
  }

  @Input('matPopoverClickable')
  get clickable(): any { return this._targetClickable || this._sourceClickable; }
  set clickable(value: any) {
    this._targetClickable = value === undefined || value === null || value === '' ? true : value;
    this._sourceClickable = value === undefined || value === null || value === '' ? true : value;
    if (!this._config) {
      this._config = {} as any;
    }
    this._config.targetClickable = this._targetClickable;
    this._config.sourceClickable = this._sourceClickable;
    this._refreshView();
  }

  @Input('matPopoverMargin')
  get margin(): any { return this._margin; }
  set margin(value: any) {
    this._margin = value === undefined ? '' : value;
    if (!this._config) {
      this._config = {} as any;
    }
    this._config.margin = this._margin;
    this._refreshView();
  }

  @Input('matPopover')
  get component(): any { return this._component; }
  set component(value: any) {
    this._component = value;
    if (!this._config) {
      this._config = {} as any;
    }
    this._config.component = this._component;
  }

  get clicked(): boolean { return this._tooltipInstance && this._tooltipInstance.clicked; }
  get grouped(): boolean { return this._popoverGroupDirective && this._popoverGroupDirective.grouped; }

  @Output('popoverClicked') popoverClicked: EventEmitter<boolean> = new EventEmitter();
  @Output('popoverRefreshed') popoverRefreshed: EventEmitter<any> = new EventEmitter();
  @Output('popoverChanged') popoverChanged: EventEmitter<any> = new EventEmitter();

  constructor(
    _overlay: Overlay,
    _elementRef: ElementRef<HTMLElement>,
    _scrollDispatcher: ScrollDispatcher,
    _viewContainerRef: ViewContainerRef,
    _ngZone: NgZone,
    _platform: Platform,
    _ariaDescriber: AriaDescriber,
    _focusMonitor: FocusMonitor,
    @Inject(MAT_TOOLTIP_SCROLL_STRATEGY) _scrollStrategy: any,
    protected _injector: Injector,
    @Optional() _dir: Directionality,
    @Optional() @Inject(MAT_TOOLTIP_DEFAULT_OPTIONS) _defaultOptions: MatTooltipDefaultOptions,
    @Optional() @Inject(PopoverGroupDirective) protected _popoverGroupDirective: PopoverGroupDirective
  ) {
    super(_overlay, _elementRef, _scrollDispatcher, _viewContainerRef, _ngZone, _platform, _ariaDescriber, _focusMonitor, _scrollStrategy, _dir, _defaultOptions);
  }

  ngOnInit() {
    if (this._popoverGroupDirective && this._popoverGroupDirective.grouped) {
      this.index = this._popoverGroupDirective.popoverCount;
      this._popoverGroupDirective.popoverCount++;
    }
  }

  @HostListener('mouseenter', ['$event'])
  _handleComponentMouseenter(event) {
    this.hovered = true;
  }

  @HostListener('mouseleave', ['$event'])
  _handleComponentMouseleave(event) {
    this.hovered = false;
  }

  @HostListener('click', ['$event'])
  _handleComponentClick(event) {
    if (this.sourceClickable) {
      this.toggleClick(event);
    }
  }

  toggleClick(event?) {
    if (event) {
      event.stopPropagation();
    }
    if (this._popoverGroupDirective && this._popoverGroupDirective.grouped) {
      this._popoverGroupDirective.setClickedPopover(this, this.index);
    }
    if (this._tooltipInstance) {
      if (!this._popoverGroupDirective || !this._popoverGroupDirective.grouped) {
        this.show(0);
      }
      this._tooltipInstance.clicked = !this._tooltipInstance.clicked;
      this.popoverClicked.emit(this._tooltipInstance.clicked);
    }
    setTimeout(() => this._overlayRef.updatePosition());
  }

  hideGroupedPopovers() {
    if (this._popoverGroupDirective && this._popoverGroupDirective.grouped) {
      this._popoverGroupDirective.reset();
    }
    this.popoverClicked.emit(this._tooltipInstance.clicked);
  }

  show(delay: number = this.showDelay) {
    if (!this._popoverGroupDirective || !this._popoverGroupDirective.grouped || !this._popoverGroupDirective.hasClickedPopover() || this._popoverGroupDirective.popoverAlwaysShow) {

      if (this.disabled || (this._isTooltipVisible() && !this._tooltipInstance!._showTimeoutId && !this._tooltipInstance!._hideTimeoutId)) {
        return;
      }

      this._config.directive = this;

      this._overlayRef = (<any>this)._createOverlay() as OverlayRef;

      this._overlayRef.addPanelClass('mat-popover-panel');

      const injector = this._createPopoverInjector(this._config);

      (<any>this)._detach();

      (<any>this)._portal = new ComponentPortal(MaterialPopoverComponent, (<any>this)._viewContainerRef, injector);

      this._tooltipInstance = this._overlayRef.attach((<any>this)._portal).instance as MaterialPopoverComponent;
      this._tooltipInstance._grouped = !!this._popoverGroupDirective;

      this._tooltipInstance.afterHidden().pipe(takeUntil((<any>this)._destroyed)).subscribe(() => (<any>this)._detach());

      (<any>this)._setTooltipClass((<any>this)._tooltipClass);
      (<any>this)._updateTooltipMessage();

      this._tooltipInstance!.show(delay);
    }
  }

  hide(delay: number = this.hideDelay) {
    setTimeout(() => {
      if (this._tooltipInstance && !this._tooltipInstance.clicked && !this._tooltipInstance.hovered) {
        super.hide(delay);
      }
    }, 1);
  }

  private _refreshView() {
    if (this._tooltipInstance) {
      this._tooltipInstance.refreshView();
    }
  }

  private _createPopoverInjector(data: PopoverData): PortalInjector {
    const injectorTokens = new WeakMap();

    data.index = this.index;

    injectorTokens.set(POPOVER_DATA, data);
    return new PortalInjector(this._injector, injectorTokens);
  }
}
