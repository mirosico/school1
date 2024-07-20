import { CdkDrag } from "@angular/cdk/drag-drop";
import { NgForOf } from "@angular/common";
import {
    Component, Input, OnInit
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatTableModule } from "@angular/material/table";
import { BehaviorSubject } from "rxjs";

import { DownloadService } from "../../../shared/services/download/download.service";
import { GradesService } from "../../../shared/services/grades/grades.service";
import { GroupsService } from "../../../shared/services/groups/groups.service";
import { LessonsService } from "../../../shared/services/lessons/lessons.service";
import { NotificationsService } from "../../../shared/services/notifications/notifications.service";
import { ScheduleService } from "../../../shared/services/schedule/schedule.service";
import { ScheduleMatrixService } from "../../../shared/services/schedule/schedule-matrix.service";

@Component({
    selector: "app-grades-schedule",
    standalone: true,
    imports: [
        CdkDrag,
        NgForOf,
        MatTableModule,
        MatButtonModule
    ],
    templateUrl: "./grades-schedule.component.html",
    styleUrl: "../schedule/schedule.component.scss"
})
export class GradesScheduleComponent implements OnInit {
    dayNames = this.scheduleMatrixService.dayNames;
    days = this.scheduleMatrixService.days;
    slots = this.scheduleMatrixService.slots;
    grades = this.gradesService.grades;
    filteredGrades = this.grades;
    draggableData: { grade: Grade; day: Day; slot: Slot } | null = null;
    lessons: Lesson[] = [];
    tableId = "grades-schedule";

    @Input({ required: true }) search!: BehaviorSubject<string>;

    constructor(
        private scheduleMatrixService: ScheduleMatrixService,
        private gradesService: GradesService,
        private scheduleService: ScheduleService,
        private notificationService: NotificationsService,
        private downloadService: DownloadService,
        private lessonsService: LessonsService,
        private groupService: GroupsService,
    ) {}

    ngOnInit() {
        this.search.subscribe((search) => {
            this.filteredGrades = this.grades.filter((grade) => grade.toLowerCase().includes(search.toLowerCase()));
        });
        this.lessonsService.lessons$.subscribe((lessons) => {
            this.lessons = lessons;
        });
    }

    saveSchedule() {
        this.downloadService.generatePdf(this.tableId);
    }

    getSubjectDisplayData(grade: Grade, day: Day, slot: Slot) {
        const gradeGroups = this.groupService.findGradeGroups(grade);
        const lessonsThisTime = this.lessons.filter((l) => l.time.day === day && l.time.slot === slot);
        const groupsIdThisTime = lessonsThisTime.map((l) => l.group.id);
        const groups = gradeGroups.filter((g) => groupsIdThisTime.includes(g.id));
        if (!groups[0]) {
            return "-/-";
        }
        const groupsText = groups.map((group) => {
            const { teacher } = group;
            return `Група ${group.group} - ${teacher?.name}`;
        }).join("/") ?? "";
        return `${groups[0].subject?.label ?? ""}: ${groupsText}`;
    }

    swapLessons(grade: Grade, day: Day, slot: Slot) {
        if (!this.draggableData) {
            return;
        }
        const { grade: srcGrade, ...src } = this.draggableData;
        const canSwap = this.scheduleService.canSwapLessons(grade, src, {
            day,
            slot
        });
        if (!canSwap.src.available || !canSwap.dest.available) {
            const message = canSwap.src.reason || canSwap.dest.reason;
            this.notificationService.show(message!);
            return;
        }
        this.scheduleService.swapLessons(grade, src, {
            day,
            slot
        });
        this.notificationService.show("Успішно замінено");
    }

    dragStart(grade: Grade, day: Day, slot: Slot) {
        this.draggableData = { grade, day, slot };
    }

    dragEnd(event: DragEvent, grade: Grade, day: Day, slot: Slot) {
        this.swapLessons(grade, day, slot);
        this.draggableData = null;
        this.removeHoverClass(event);
        event.preventDefault();
    }

    dragOver(event: DragEvent, grade: Grade, day: Day, slot: Slot) {
        const isSameCell = this.draggableData?.day === day && this.draggableData?.slot === slot
        && this.draggableData?.grade === grade;
        if (isSameCell) {
            return;
        }
        const isOtherGrade = this.draggableData?.grade !== grade;
        if (isOtherGrade) {
            return;
        }
        event.preventDefault();
        const target = event.target as HTMLElement;
        if (!target.classList.contains("dragover") && target.classList.contains("cell")) {
            target.classList.add("dragover");
        }
    }

    dragLeave(event: DragEvent) {
        event.preventDefault();
        this.removeHoverClass(event);
    }

    removeHoverClass(event: DragEvent) {
        const target = event.target as HTMLElement;
        if (target.classList.contains("dragover")) {
            target.classList.remove("dragover");
        }
    }

    getCellId(grade: Grade, day: Day, slot: Slot) {
        return `cell-${grade}-${day}-${slot}`;
    }
}
