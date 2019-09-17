import { Directive, Renderer2, ElementRef, ChangeDetectorRef, Optional, Input, Output, EventEmitter } from '@angular/core';
import { ScrollVisibleDirective, ScrollVisibleViewportDirective } from './scroll-visible';
import { map, distinctUntilChanged } from 'rxjs/operators';

@Directive({
  selector: '[sticky-viewport]'
})
export class StickyViewportDirective extends ScrollVisibleDirective { }

@Directive({
  selector: '[sticky]'
})
export class StickyDirective extends ScrollVisibleDirective {

  private _stickyUntil: number;
  private _stickyPosition: string = 'top';
  private _sticky: boolean = false;

  @Input('stickyPosition')
  get stickyPosition() { return this._stickyPosition; }
  set stickyPosition(value: string) {
    this._stickyPosition = value;
  }

  @Input('stickyUntil')
  get stickyUntil() { return this._stickyUntil; }
  set stickyUntil(value: number) {
    this._stickyUntil = typeof value === 'string' ? Number(value) : value;
  }

  get sticky(): boolean { return this._sticky; }

  @Output('stickyState') stickyState: EventEmitter<boolean> = new EventEmitter();

  constructor(
    protected elementRef: ElementRef<HTMLElement>,
    protected renderElementRefer: Renderer2,
    protected changeDetector: ChangeDetectorRef,
    @Optional() protected viewport?: ScrollVisibleViewportDirective
  ) {
    super(elementRef, changeDetector, viewport);

    setTimeout(() => {
      const saveOffsetTop = this.getOffsetTop();

      if (this.getViewportOffsetTop() >= saveOffsetTop + (this._stickyUntil || 0)) {
        this.setStickyPosition();
      }

      this.scrolled(0, false).pipe(
        map(() => {

          const viewportOffsetTop = this.getViewportOffsetTop();

          if ((this._stickyUntil !== undefined && viewportOffsetTop >= saveOffsetTop + this._stickyUntil) || viewportOffsetTop < saveOffsetTop) {
            this.removeStickyPosition();
          } else {
            this.setStickyPosition();
          }

          if (viewportOffsetTop < saveOffsetTop) {
            this._sticky = false;
          }
          return this._sticky;
        }),
        distinctUntilChanged()
      ).subscribe((sticky) => {
        this.stickyState.emit(sticky);
      });
    });
  }

  removeStickyPosition(): void {
    this.renderElementRefer.removeStyle(this.elementRef.nativeElement, 'position');
    this.renderElementRefer.removeStyle(this.elementRef.nativeElement, this._stickyPosition);
    this._sticky = false;
  }

  setStickyPosition(): void {
    this.renderElementRefer.setStyle(this.elementRef.nativeElement, 'position', 'sticky');
    this.renderElementRefer.setStyle(this.elementRef.nativeElement, this._stickyPosition, '0px');
    this._sticky = true;
  }

}