import {
  Directive,
  Input,
  OnDestroy,
  OnInit,
  ElementRef,
  Output,
  EventEmitter
} from '@angular/core';
import { fromEvent, merge, Subscription } from 'rxjs';
import { switchMap, map, takeUntil,tap } from 'rxjs';


export type SwiperType = ['horizontal', 'vertical', 'both'];
@Directive({
  selector: '[appSwipper]'
})
export class SwipperDirective {

  @Output() select:EventEmitter<any>=new EventEmitter<any>()
  posIni!: { x: number; y: number };
  swiper: number = 10;
  scrollBarHeight: number = 0;
  subscription!: Subscription;
  avoidScroll: Subscription = fromEvent(
    this.elementRef.nativeElement,
    'touchmove'
  ).subscribe((e: any) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  });

  @Input('swiper-scroll') direction: '' | 'horizontal' | 'vertical' | 'both' =
    'horizontal';

  constructor(private elementRef: ElementRef) {}
  ngOnInit() {
    this.subscription = merge(
      fromEvent(this.elementRef.nativeElement, 'mousedown'),
      fromEvent(this.elementRef.nativeElement, 'touchstart').pipe(
        map((event: any) => event.changedTouches[0])
      )
    )
      .pipe(
        switchMap((touchIni: any) => {
          return merge(
            fromEvent(this.elementRef.nativeElement, 'mousemove'),
            fromEvent(this.elementRef.nativeElement, 'touchmove').pipe(
              map((event: any) => event.changedTouches[0])
            )
          ).pipe(
            takeUntil(
              merge(
                fromEvent(document, 'mouseup'),
                fromEvent(document, 'touchend').pipe(
                  map((event: any) => event.changedTouches[0])
                )
              ).pipe(
                tap((touchEnd)=>{
                  if (Math.abs(touchEnd.pageX - touchIni.pageX)<10)
                  {
                    const item=(([...this.elementRef.nativeElement.children] || []).filter(x=>x.contains(touchEnd.target)) ||[null])[0]
                    if (item)
                      this.select.emit(item)
                  }
                }))
          ),map((touchEnd: any) => {
            return {
              touchIni: touchIni,
              touchEnd: touchEnd,
            };
          })
        )
        })
      )
      .subscribe((res: any) => {
        const incX = res.touchEnd.pageX - res.touchIni.pageX;
        const incY = res.touchEnd.pageY - res.touchIni.pageY;
        this.elementRef.nativeElement.scrollBy({
          left: this.direction!='vertical'?-incX:0,
          right:this.direction!='horizontal'?-incY:0,
          behavior: "smooth",
        });
      });
  }

  ngOnDestroy() {
    this.subscription && this.subscription.unsubscribe();
    this.avoidScroll && this.avoidScroll.unsubscribe();
  }

}
