import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeSubjectsComponent } from './grade-subjects.component';

describe('GradeSubjectsComponent', () => {
  let component: GradeSubjectsComponent;
  let fixture: ComponentFixture<GradeSubjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradeSubjectsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GradeSubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
