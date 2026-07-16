import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternshipRecivedComponent } from './internship-recived.component';

describe('InternshipRecivedComponent', () => {
  let component: InternshipRecivedComponent;
  let fixture: ComponentFixture<InternshipRecivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InternshipRecivedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InternshipRecivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
