import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitCommunityComponent } from './exit-community.component';

describe('ExitCommunityComponent', () => {
  let component: ExitCommunityComponent;
  let fixture: ComponentFixture<ExitCommunityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExitCommunityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExitCommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
