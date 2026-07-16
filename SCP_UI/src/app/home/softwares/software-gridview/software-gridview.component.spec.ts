import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareGridviewComponent } from './software-gridview.component';

describe('SoftwareGridviewComponent', () => {
  let component: SoftwareGridviewComponent;
  let fixture: ComponentFixture<SoftwareGridviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoftwareGridviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SoftwareGridviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
