import { Component, Input } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatGridListModule } from "@angular/material/grid-list";
import type { BehaviorSubject, Subscription } from "rxjs";
import { filter, map, tap } from "rxjs";

import { ScheduleMatrixService } from "../../../../shared/services/schedule/schedule-matrix.service";
import { TeachersService } from "../../../../shared/services/teachers/teachers.service";

@Component({
    selector: "app-teacher-blocked-time",
    standalone: true,
    imports: [
        MatCheckboxModule,
        MatGridListModule,
        ReactiveFormsModule
    ],
    templateUrl: "./teacher-blocked-time.component.html",
    styleUrl: "./teacher-blocked-time.component.scss"
})
export class TeacherBlockedTimeComponent {
    days!: Day[];
    slots!: Slot[];
    blockedLessonMatrix!: boolean[][];
    @Input({ required: true })
        teacherId!: BehaviorSubject<Teacher["id"] | null>;
    private teacherIdSubscription: Subscription | null = null;

    constructor(private teachersService: TeachersService, private scheduleMatrixService: ScheduleMatrixService) {
        this.days = this.scheduleMatrixService.days;
        this.slots = this.scheduleMatrixService.slots;
    }

    ngOnInit() {
        this.teacherIdSubscription = this.teacherId.pipe(
            filter((teacherId) => teacherId !== null),
            tap(() => {
                this.scheduleMatrixService.clearMatrix();
                this.blockedLessonMatrix = this.scheduleMatrixService.matrix;
            }),
            map((teacherId) => this.teachersService.findTeacherById(teacherId as Teacher["id"])),
            map((teacher) => teacher?.notAvailable ?? []),
            tap((blockedTime) => {
                blockedTime.forEach(({ day, slot }) => {
                    this.blockedLessonMatrix[day][slot] = true;
                });
            })
        ).subscribe();
    }

    ngOnDestroy() {
        this.teacherIdSubscription?.unsubscribe();
    }

    getDayName(day: Day) {
        return this.scheduleMatrixService.getDayName(day);
    }

    onCheckboxChange(checked: boolean, day: Day, slot: Slot) {
        this.blockedLessonMatrix[day][slot] = checked;
        const currentTeacher = this.teacherId.value && this.teachersService.findTeacherById(this.teacherId.value);
        if (!currentTeacher) {
            throw new Error("Teacher not found");
        }
        const notAvailable = currentTeacher.notAvailable
            ?.filter(({ day: blockedDay, slot: blockedSlot }) => blockedDay !== day || blockedSlot !== slot) ?? [];
        const updatedTeacher = {
            ...currentTeacher,
            notAvailable: checked ? [...notAvailable, { day, slot }] : notAvailable
        };
        this.teachersService.updateTeacher(updatedTeacher);
    }
}
