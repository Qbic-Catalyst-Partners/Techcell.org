import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratorRegistrationComponent } from './moderator-registration.component';

describe('ModeratorRegistrationComponent', () => {
  let component: ModeratorRegistrationComponent;
  let fixture: ComponentFixture<ModeratorRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModeratorRegistrationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModeratorRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
