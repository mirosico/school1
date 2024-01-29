import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachersBlockedTimeComponent } from './teachers-blocked-time.component';

describe('TeachersBlockedTimeComponent', () => {
  let component: TeachersBlockedTimeComponent;
  let fixture: ComponentFixture<TeachersBlockedTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeachersBlockedTimeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeachersBlockedTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
