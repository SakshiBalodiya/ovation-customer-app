import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderplacedPage } from './orderplaced.page';

describe('OrderplacedPage', () => {
  let component: OrderplacedPage;
  let fixture: ComponentFixture<OrderplacedPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderplacedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
