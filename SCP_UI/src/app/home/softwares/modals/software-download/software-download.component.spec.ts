import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareDownloadComponent } from './software-download.component';

describe('SoftwareDownloadComponent', () => {
  let component: SoftwareDownloadComponent;
  let fixture: ComponentFixture<SoftwareDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoftwareDownloadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SoftwareDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
