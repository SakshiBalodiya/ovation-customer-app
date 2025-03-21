import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomalertPage } from './customalert.page';

describe('CustomalertPage', () => {
  let component: CustomalertPage;
  let fixture: ComponentFixture<CustomalertPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomalertPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
