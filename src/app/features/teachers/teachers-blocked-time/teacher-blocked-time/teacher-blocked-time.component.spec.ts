import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherBlockedTimeComponent } from './teacher-blocked-time.component';

describe('TeacherBlockedTimeComponent', () => {
  let component: TeacherBlockedTimeComponent;
  let fixture: ComponentFixture<TeacherBlockedTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherBlockedTimeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeacherBlockedTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
