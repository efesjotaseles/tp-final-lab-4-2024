import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  standalone: false,
})
export class PaginationComponent {
  @Input() currentPage: number = -1;
  @Input() totalPages: number = -1;
  @Output() changePage: EventEmitter<number> = new EventEmitter<number>();
  public displayedPages: number[] = [];
  public pageRange: number = 5;

  updateDisplayedPages() {
    let startPage = Math.max(
      1,
      this.currentPage - Math.floor(this.pageRange / 2)
    );
    let endPage = Math.min(this.totalPages, startPage + this.pageRange - 1);

    if (endPage - startPage < this.pageRange - 1) {
      startPage = Math.max(1, endPage - this.pageRange + 1);
    }
    this.displayedPages = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  }

  handleChange(requestedPage: number) {
    this.currentPage = requestedPage;
    this.changePage.emit(this.currentPage);
    this.updateDisplayedPages();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.handleChange(this.currentPage + 1);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.handleChange(this.currentPage - 1);
    }
  }

  ngOnInit() {
    this.updateDisplayedPages();
    //console.log(this.pages);
  }
}
