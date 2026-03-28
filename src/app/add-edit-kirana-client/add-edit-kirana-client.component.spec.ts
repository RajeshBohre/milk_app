import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditKiranaClientComponent } from './add-edit-kirana-client.component';

describe('AddEditKiranaClientComponent', () => {
  let component: AddEditKiranaClientComponent;
  let fixture: ComponentFixture<AddEditKiranaClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditKiranaClientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditKiranaClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
