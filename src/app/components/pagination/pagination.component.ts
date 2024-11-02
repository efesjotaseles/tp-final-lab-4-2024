import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  @Input() currentPage: number = -1;
  //@Input() totalPages: number = -1;
  @Output() changePage: EventEmitter<number> = new EventEmitter<number>();

  handleChange(direction: number) {
    this.changePage.emit(direction);
  }
}
