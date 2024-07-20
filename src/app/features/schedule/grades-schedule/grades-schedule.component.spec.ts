import { ComponentFixture, TestBed } from "@angular/core/testing";

import { GradesScheduleComponent } from "./grades-schedule.component";

describe("GradesScheduleComponent", () => {
    let component: GradesScheduleComponent;
    let fixture: ComponentFixture<GradesScheduleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GradesScheduleComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(GradesScheduleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
