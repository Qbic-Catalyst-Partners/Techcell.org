import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-header-filter',
  templateUrl: './header-filter.component.html',
  styleUrl: './header-filter.component.scss',
})
export class HeaderFilterComponent {
  @Input() data_list: [] = [];
  @Input() hasAsscessToAdd: boolean = false;
  @Input() isAdd:boolean = true;
  @Output() addBlog = new EventEmitter<any>();
  @Output() navigateTo = new EventEmitter<any>();
  @Output() getSelectedTag = new EventEmitter<any>();

  public term!: string;

  public scrollTo(element: HTMLElement, direction: number) {
    element.scrollBy({
      left: direction * 200,
      behavior: 'smooth',
    });
  }

  public trigSelectedTag(evt: any): void {
    this.getSelectedTag.emit(evt);
  }

  public trigBlog() {
    this.addBlog.emit(true);
  }

  public trigNavigate() {
    this.navigateTo.emit(true);
  }
}
