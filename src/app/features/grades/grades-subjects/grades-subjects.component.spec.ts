import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradesSubjectsComponent } from './grades-subjects.component';

describe('GradesSubjectsComponent', () => {
  let component: GradesSubjectsComponent;
  let fixture: ComponentFixture<GradesSubjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradesSubjectsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GradesSubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
