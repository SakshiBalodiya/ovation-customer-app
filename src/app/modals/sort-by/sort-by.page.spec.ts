import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SortByPage } from './sort-by.page';

describe('SortByPage', () => {
  let component: SortByPage;
  let fixture: ComponentFixture<SortByPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SortByPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
