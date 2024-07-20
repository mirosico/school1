import { NgForOf } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { BehaviorSubject } from "rxjs";

import { DownloadService } from "../../../shared/services/download/download.service";
import { GroupsService } from "../../../shared/services/groups/groups.service";
import { LessonsService } from "../../../shared/services/lessons/lessons.service";
import { ScheduleMatrixService } from "../../../shared/services/schedule/schedule-matrix.service";
import { TeachersService } from "../../../shared/services/teachers/teachers.service";

@Component({
    selector: "app-teachers-schedule",
    standalone: true,
    imports: [
        NgForOf,
        MatButtonModule
    ],
    templateUrl: "./teachers-schedule.component.html",
    styleUrl: "../schedule/schedule.component.scss"
})
export class TeachersScheduleComponent {
    dayNames = this.scheduleMatrixService.dayNames;
    days = this.scheduleMatrixService.days;
    slots = this.scheduleMatrixService.slots;
    teachers: Teacher[] = [];
    filteredTeachers = this.teachers;
    tableId = "teachers-schedule";
    @Input({ required: true }) search!: BehaviorSubject<string>;

    constructor(
        private scheduleMatrixService: ScheduleMatrixService,
        private teachersService: TeachersService,
        private downloadService: DownloadService,
        private lessonsService: LessonsService,
        private groupService: GroupsService,
    ) {}

    ngOnInit() {
        this.teachersService.teachers$.subscribe((teachers) => {
            this.teachers = teachers;
            this.filteredTeachers = teachers;
        });
        this.search.subscribe((search) => {
            this.filteredTeachers = this.teachers
                .filter((teacher) => teacher.name.toLowerCase().includes(search.toLowerCase()));
        });
    }

    saveSchedule() {
        this.downloadService.generatePdf(this.tableId);
    }

    isBlocked(teacherId: Teacher["id"], day: Day, slot: Slot) {
        return this.teachersService.isBusy(teacherId, { day, slot });
    }

    getSubjectDisplayData(teacher: Teacher, day: Day, slot: Slot) {
        const groups = this.groupService.getGroups();
        const lessons = this.lessonsService.findLessons({
            teacherId: teacher.id,
            time: {
                day,
                slot
            } as Time
        });
        const groupIdsThisTime = lessons.map((lesson) => lesson.group.id);
        const groupsThisTime = groups.filter((group) => groupIdsThisTime.includes(group.id));
        const { subject } = groupsThisTime[0] ?? {};
        if (!subject) {
            return "-/-";
        }
        const groupsText = groupsThisTime.map((group) => `${subject.grade}(${group.group})`).join("") ?? "";
        return `${subject?.label ?? ""}: ${groupsText}`;
    }
}
