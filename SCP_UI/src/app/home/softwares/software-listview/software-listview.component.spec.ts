import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareListviewComponent } from './software-listview.component';

describe('SoftwareListviewComponent', () => {
  let component: SoftwareListviewComponent;
  let fixture: ComponentFixture<SoftwareListviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoftwareListviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SoftwareListviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
