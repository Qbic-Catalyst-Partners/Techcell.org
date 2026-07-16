import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationModelComponent } from './navigation-model.component';

describe('NavigationModelComponent', () => {
  let component: NavigationModelComponent;
  let fixture: ComponentFixture<NavigationModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavigationModelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavigationModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
