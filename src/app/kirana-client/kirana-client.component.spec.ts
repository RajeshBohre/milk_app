import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KiranaClientComponent } from './kirana-client.component';

describe('KiranaClientComponent', () => {
  let component: KiranaClientComponent;
  let fixture: ComponentFixture<KiranaClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KiranaClientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KiranaClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
