import { Component, Input } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatGridListModule } from "@angular/material/grid-list";
import type { BehaviorSubject, Subscription } from "rxjs";
import { filter, map, tap } from "rxjs";

import { ScheduleService } from "../../../../shared/schedule.service";
import { TeachersService } from "../../../../shared/teachers.service";

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
    lessons!: Lesson[];
    blockedTimeMatrix!: boolean[][];
    @Input({ required: true })
        teacherId!: BehaviorSubject<Teacher["id"] | null>;
    private teacherIdSubscription: Subscription | null = null;

    constructor(private teachersService: TeachersService, private scheduleService: ScheduleService) {
        this.days = this.scheduleService.getDays();
        this.lessons = this.scheduleService.getLessons();
    }

    ngOnInit() {
        this.teacherIdSubscription = this.teacherId.pipe(
            filter((teacherId) => teacherId !== null),
            tap(() => this.initBlockedTimeMatrix()),
            map((teacherId) => this.teachersService.getTeacherById(teacherId as Teacher["id"])),
            map((teacher) => teacher?.blockedTime ?? []),
            tap((blockedTime) => {
                blockedTime.forEach(({ day, time }) => {
                    this.blockedTimeMatrix[day][time] = true;
                });
            })
        ).subscribe();
    }

    ngOnDestroy() {
        this.teacherIdSubscription?.unsubscribe();
    }

    getDayName(day: Day) {
        return this.scheduleService.getDayName(day);
    }

    onCheckboxChange(checked: boolean, day: Day, lesson: Lesson) {
        this.blockedTimeMatrix[day][lesson] = checked;
        this.teachersService.teachers.next(this.teachersService.teachers.value.map(
            (teacher) => {
                if (teacher.id !== this.teacherId.value) {
                    return teacher;
                }
                const filteredBlockedTime = (teacher.blockedTime ?? []).filter(
                    (blockedTime) => blockedTime.day !== day || blockedTime.time !== lesson
                );
                const blockedTime = checked ? [...filteredBlockedTime, { day, time: lesson }] : filteredBlockedTime;
                return { ...teacher, blockedTime };
            }
        ));
    }

    private initBlockedTimeMatrix() {
        this.blockedTimeMatrix = new Array(this.days.length).fill(false)
            .map(() => new Array(this.lessons.length).fill(false));
    }
}
