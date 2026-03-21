import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillAddEditComponent } from './bill-add-edit.component';

describe('BillAddEditComponent', () => {
  let component: BillAddEditComponent;
  let fixture: ComponentFixture<BillAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BillAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
