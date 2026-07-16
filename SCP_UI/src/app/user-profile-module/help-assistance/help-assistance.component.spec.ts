import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpAssistanceComponent } from './help-assistance.component';

describe('HelpAssistanceComponent', () => {
  let component: HelpAssistanceComponent;
  let fixture: ComponentFixture<HelpAssistanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HelpAssistanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HelpAssistanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
