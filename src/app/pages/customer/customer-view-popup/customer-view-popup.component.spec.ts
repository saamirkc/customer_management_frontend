import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerViewPopupComponent } from './customer-view-popup.component';

describe('CustomerViewPopupComponent', () => {
  let component: CustomerViewPopupComponent;
  let fixture: ComponentFixture<CustomerViewPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerViewPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerViewPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
