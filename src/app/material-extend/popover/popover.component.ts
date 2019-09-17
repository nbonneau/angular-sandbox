import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ChangeDetectorRef,
  Inject,
  InjectionToken,
  ViewContainerRef,
  ComponentFactoryResolver,
  ViewChild,
  AfterViewInit,
  Injector,
  ComponentRef,
  ElementRef,
  Renderer2,
  HostListener
} from '@angular/core';
import { TooltipComponent, matTooltipAnimations } from '@angular/material';
import { BreakpointObserver } from '@angular/cdk/layout';
import { PortalInjector } from '@angular/cdk/portal';
import { PopoverDirective } from './popover.directive';

export const POPOVER_DATA = new InjectionToken<PopoverData>('POPOVER_DATA');

export const POPOVER_CONFIG = new InjectionToken<PopoverConfig>('POPOVER_CONFIG');

export interface PopoverData {
  component: any;
  directive?: PopoverDirective;
  margin?: string;
  data?: { [key: string]: any };
  sourceClickable?: boolean;
  targetClickable?: boolean;
  showDelay?: number;
  hideDelay?: number;
  index?: number;
}

export interface PopoverConfig {
  clicked: boolean;
  index: number;
  element: ElementRef;
  position: string;
  extra: { [key: string]: any };
}

@Component({
  selector: 'mat-popover',
  template: `
  <div #popover class="mat-popover" [class.mat-tooltip-handset]="(_isHandset | async)?.matches" [@state]="_visibility" (@state.start)="_animationStart()" (@state.done)="_animationDone($event)">
      <div #popoverContainer></div>
  </div>`,
  styles: [
    '.cdk-overlay-pane.mat-popover-panel { pointer-events: auto !important; }',
    '.mat-tooltip-handset { margin: 24px; padding-left: 16px; padding-right: 16px; }'
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [matTooltipAnimations.tooltipState],
  host: {
    '[style.zoom]': '_visibility === "visible" ? 1 : null',
    'aria-hidden': 'true',
  }
})
export class PopoverComponent extends TooltipComponent implements AfterViewInit {

  hovered: boolean;

  _grouped: boolean;

  protected _clicked: boolean = false;
  protected _componentRef: ComponentRef<any>;

  @ViewChild('popoverContainer', { read: ViewContainerRef }) popoverContainerRef: ViewContainerRef;
  @ViewChild('popover') popover: ElementRef;

  get clicked(): boolean { return this._clicked; }
  set clicked(value: boolean) {
    this._clicked = value;
    if (this._clicked) {
      this._renderer.addClass(this.popover.nativeElement, 'mat-popover-clicked');
    } else {
      this._renderer.removeClass(this.popover.nativeElement, 'mat-popover-clicked');
    }
    this.refreshView();
  }

  constructor(
    _changeDetectorRef: ChangeDetectorRef,
    _breakpointObserver: BreakpointObserver,
    protected _componentFactoryResolver: ComponentFactoryResolver,
    protected _injector: Injector,
    protected _renderer: Renderer2,
    @Inject(POPOVER_DATA) public data: PopoverData
  ) {
    super(_changeDetectorRef, _breakpointObserver);
  }

  ngAfterViewInit() {
    this._injectComponent();
    this._renderer.setStyle(this.popover.nativeElement, 'margin', this.data.margin);
  }

  refreshView() {
    if (this._componentRef) {
      this._componentRef.destroy();
    }
    this._injectComponent();
    this.data.directive.popoverRefreshed.emit(this.data.data);
  }

  @HostListener('mouseenter')
  _handleComponentMouseenter() {
    if (!this.data.directive.disabledHover) {
      this.hovered = true;
    }
  }

  @HostListener('mouseleave')
  _handleComponentMouseleave() {
    this.hovered = false;
    setTimeout(() => {
      if (this.data.directive._isTooltipVisible() && !this.data.directive.hovered) {
        this.data.directive.hide();
      }
    });
  }

  @HostListener('click', ['$event'])
  _handleComponentClickInside(event) {
    this._handleComponentInteraction({
      inside: true,
      target: event.target,
      event,
    });
    if (this.popover.nativeElement.classList.contains('mat-popover-clicked') || this.data.directive.targetClickable) {
      event.stopPropagation();
    }
  }

  @HostListener('body:click')
  _handleBodyClick() {
    if (!this._grouped) {
      this._handleBodyInteraction();
    } else {
      this._handleComponentInteraction({
        inside: false,
        target: event.target,
        event
      });
    }
  }

  _handleBodyInteraction() {
    if (this.data.directive.hovered && !this.data.directive.sourceClickable) {
      return;
    }
    this.data.directive._tooltipInstance.clicked = false;
    this.data.directive.hideGroupedPopovers();
    super._handleBodyInteraction();
  }

  private _handleComponentInteraction(event) {
    if (event && !event.inside) {
      if (!this.data.directive.hovered) {
        this.data.directive.hideGroupedPopovers();
      }
    } else {
      if (this.data.directive.targetClickable) {
        this.data.directive.toggleClick();
      }
    }
  }

  private _injectComponent() {

    this.popoverContainerRef.clear();

    const factory = this._componentFactoryResolver.resolveComponentFactory(this.data.component);
    this._componentRef = this.popoverContainerRef.createComponent(factory, 0, this._createComponentInjector({
      clicked: this._clicked,
      index: this.data.index,
      extra: this.data.data || {},
      element: (<any>this.data.directive)._elementRef,
      position: this.data.directive.position
    }));

    this._componentRef.changeDetectorRef.detectChanges();
  }

  private _createComponentInjector(data: PopoverConfig): PortalInjector {

    const injectorTokens = new WeakMap();

    injectorTokens.set(POPOVER_CONFIG, data);

    return new PortalInjector(this._injector, injectorTokens);
  }

}
