import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradesParallelsComponent } from './grades-parallels.component';

describe('GradesParallelsComponent', () => {
  let component: GradesParallelsComponent;
  let fixture: ComponentFixture<GradesParallelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradesParallelsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradesParallelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
