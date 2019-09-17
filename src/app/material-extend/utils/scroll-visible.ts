import { Directive, ElementRef, AfterViewInit, Optional, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { CdkScrollable } from '@angular/cdk/overlay';
import { fromEvent, Observable } from 'rxjs';
import { throttleTime, map, distinctUntilChanged, share, pairwise } from 'rxjs/operators';

export interface Offsets {
  top: number;
  bottom: number;
}

export interface States {
  topVisible: boolean;
  bottomVisible: boolean;
}

@Directive({
  selector: '[scroll-visible-viewport]'
})
export class ScrollVisibleViewportDirective extends CdkScrollable {
  
}

@Directive({
  selector: '[scroll-visible]'
})
export class ScrollVisibleDirective implements AfterViewInit {

  currState: string;
  prevState: string;

  @Output('topVisible') topVisible: EventEmitter<boolean> = new EventEmitter();
  @Output('bottomVisible') bottomVisible: EventEmitter<boolean> = new EventEmitter();
  @Output('visible') visible: EventEmitter<boolean> = new EventEmitter();
  @Output('state') state: EventEmitter<string> = new EventEmitter();
  @Output('states') states: EventEmitter<Array<States>> = new EventEmitter();

  get isBehind(): boolean {
    return this.getOffsetTop() > this.getViewportOffsetTop() && this.getOffsetBottom() > this.getViewportOffsetBottom() && this.getOffsetTop() > this.getViewportOffsetBottom();
  }

  get isAbove(): boolean {
    return this.getOffsetTop() < this.getViewportOffsetTop() && this.getOffsetBottom() < this.getViewportOffsetBottom() && this.getOffsetBottom() < this.getViewportOffsetTop();
  }

  get currentState(): string {
    return this._getState([null, this.getStates()]);
  }

  constructor(
    protected elementRef: ElementRef<HTMLElement>,
    protected changeDetector: ChangeDetectorRef,
    @Optional() protected viewport?: ScrollVisibleViewportDirective
  ) { }

  ngAfterViewInit() {

    const resizeEvent = this.resized();
    const scrollEvent = this.scrolled();

    resizeEvent.subscribe(states => this._handleEvents(states));
    scrollEvent.subscribe(states => this._handleEvents(states));

    setTimeout(() => this._handleEvents([null, this.getStates()]));
  }

  getStates(): States {

    const viewportOffsets = this.getViewportOffsets();
    const offsets = this.getOffsets();

    return {
      topVisible: viewportOffsets.top - offsets.top <= 0 && viewportOffsets.bottom - offsets.top >= 0,
      bottomVisible: viewportOffsets.top - offsets.bottom <= 0 && viewportOffsets.bottom - offsets.bottom >= 0
    };
  }

  getOffsetTop(): number {
    return this.elementRef.nativeElement.offsetTop - (this.viewport ? this.viewport.getElementRef().nativeElement.offsetTop : 0);
  }

  getOffsetBottom(): number {
    return this.elementRef.nativeElement.offsetTop + this.elementRef.nativeElement.offsetHeight - (this.viewport ? this.viewport.getElementRef().nativeElement.offsetTop : 0);
  }

  getOffsets(): Offsets {
    return {
      top: this.getOffsetTop(),
      bottom: this.getOffsetBottom()
    }
  }

  getViewportOffsetTop(): number {
    if (this.viewport) {
      return this.viewport.measureScrollOffset('top');
    }
    return window.pageYOffset;
  }

  getViewportOffsetBottom(): number {
    if (this.viewport) {
      return this.viewport.measureScrollOffset('top') + this.viewport.getElementRef().nativeElement.offsetHeight;
    }
    return window.pageYOffset + window.innerHeight;
  }

  getViewportOffsets(): Offsets {
    return {
      top: this.getViewportOffsetTop(),
      bottom: this.getViewportOffsetBottom()
    };
  }

  scrolled(delay: number = 10, distinct: boolean = true): Observable<Array<States>> {
    const obs = this.viewport ? this.viewport.elementScrolled() : fromEvent(window, 'scroll');
    return this._attachStatePipes(obs, delay, distinct);
  }

  resized(delay: number = 100, distinct: boolean = true): Observable<any> {
    const obs = fromEvent(this.viewport ? this.viewport.getElementRef().nativeElement : window, 'resize');
    return this._attachStatePipes(obs, delay, distinct);
  }

  private _attachStatePipes(obs: Observable<any>, delay: number = 10, distinct: boolean = true): Observable<Array<States>> {

    obs = obs.pipe(throttleTime(delay));

    if (distinct) {
      obs = obs.pipe(map(() => JSON.stringify(this.getStates())), distinctUntilChanged(), map(json => JSON.parse(json)));
    } else {
      obs = obs.pipe(map(() => this.getStates()));
    }

    return obs.pipe(pairwise(), share());
  }

  private _handleEvents(states: Array<States>): void {

    this.prevState = this.currState;

    this.states.emit(states);
    this.topVisible.emit(states[1].topVisible);
    this.bottomVisible.emit(states[1].bottomVisible);
    this.visible.emit(states[1].bottomVisible && states[1].topVisible);

    if (states[1].topVisible && states[1].bottomVisible) {
      if (states[0] && !states[0].bottomVisible && states[0].topVisible) {
        this.state.emit('visible-bottom');
      } else if (states[0]) {
        this.state.emit('visible-top');
      }
      this.state.emit('visible');
      this.currState = 'visible';
    } else if (states[1].topVisible && !states[1].bottomVisible) {
      this.state.emit('partial-top');
      this.currState = 'partial-top';
    } else if (!states[1].topVisible && states[1].bottomVisible) {
      this.state.emit('partial-bottom');
      this.currState = 'partial-bottom';
    } else {
      if (states[0] && states[0].bottomVisible && !states[0].topVisible) {
        this.state.emit('invisible-top');
      } else if (states[0]) {
        this.state.emit('invisible-bottom');
      }
      this.state.emit('invisible');
      this.currState = 'invisible';
    }
    this.changeDetector.detectChanges();
  }

  private _getState(states: Array<States>): string {

    if (states[1].topVisible && states[1].bottomVisible) {
      if (states[0] && !states[0].bottomVisible && states[0].topVisible) {
        return 'visible-bottom';
      } else if (states[0]) {
        return 'visible-top';
      }
      return 'visible';
    } else if (states[1].topVisible && !states[1].bottomVisible) {
      return 'partial-top';
    } else if (!states[1].topVisible && states[1].bottomVisible) {
      return 'partial-bottom'
    }
    if (states[0] && states[0].bottomVisible && !states[0].topVisible) {
      return 'invisible-top';
    } else if (states[0]) {
      return 'invisible-bottom';
    }
    return 'invisible';
  }
}
