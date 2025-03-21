import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrdersuccessPage } from './ordersuccess.page';

describe('OrdersuccessPage', () => {
  let component: OrdersuccessPage;
  let fixture: ComponentFixture<OrdersuccessPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersuccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
