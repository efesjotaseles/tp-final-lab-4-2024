import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSearchBarComponent } from './multi-search-bar.component';

describe('MultiSearchBarComponent', () => {
  let component: MultiSearchBarComponent;
  let fixture: ComponentFixture<MultiSearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultiSearchBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
