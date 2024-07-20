import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachersSubjectsComponent } from './teachers-subjects.component';

describe('TeachersSubjectsComponent', () => {
  let component: TeachersSubjectsComponent;
  let fixture: ComponentFixture<TeachersSubjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeachersSubjectsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeachersSubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
