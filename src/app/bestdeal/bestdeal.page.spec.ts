import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BestdealPage } from './bestdeal.page';

describe('BestdealPage', () => {
  let component: BestdealPage;
  let fixture: ComponentFixture<BestdealPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BestdealPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
