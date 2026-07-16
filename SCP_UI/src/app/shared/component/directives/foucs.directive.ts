import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';

@Directive({
  selector: '[appFoucs]'
})
export class FoucsDirective {

  constructor(private element: ElementRef) {}

  @Output('Action') Action = new EventEmitter<boolean>();
  @Input('isPlay') isPlay: boolean | undefined;

  public intersectionOptions = {
    root: null, //implies the root is the document viewport
    rootMargin: '0px',
    threshold: 0.5,
  };

  ngAfterViewInit() {
    let observer = new IntersectionObserver(
      this.intersectionCallback.bind(this),
      this.intersectionOptions
    );
    if (this.isPlay) {
      observer.observe(this.element.nativeElement);
    }
  }

  intersectionCallback(entries: any, observer: any) {
    entries.forEach((entry:any) => {
      if (entry.intersectionRatio >= 0.5) {
        this.Action.emit(true); //element is completely visible in the viewport
      } else {
        this.Action.emit(false);
      }
    });
  }

}
