import { Injectable } from "@angular/core";

import { GradesService } from "../grades/grades.service";
import { GroupsService } from "../groups/groups.service";
import { LessonAvailabilityCheckerService } from "../lesson-availability-checker/lesson-availability-checker.service";
import { LessonsService } from "../lessons/lessons.service";
import { SubjectsService } from "../subjects/subjects.service";
import { ScheduleMatrixService } from "./schedule-matrix.service";

@Injectable({
    providedIn: "root"
})
export class ScheduleService {
    private readonly MAX_HOURS_DIFFERENCE = 2;

    constructor(
        private subjectsService: SubjectsService,
        private gradesService: GradesService,
        private scheduleMatrixService: ScheduleMatrixService,
        private groupsService: GroupsService,
        private lessonsService: LessonsService,
        private lessonAvailabilityCheckerService: LessonAvailabilityCheckerService
    ) {
    }

    generateSchedule() {
        this.gradesService.grades.forEach((grade) => {
            this.scheduleMatrixService.clearMatrix();
            this.subjectsService.getSubjects({ grade }, { sortByDifficulty: true }).forEach((subject) => {
                this.createLessonsForSubject(subject);
            });
        });
        this.scheduleMatrixService.clearMatrix();
    }

    clearSchedule() {
        this.scheduleMatrixService.clearMatrix();
        for (const lesson of this.lessonsService.lessons) {
            this.lessonsService.deleteLesson(lesson.id);
        }
    }

    getScheduleForGrade(grade: Grade) {
        return this.scheduleMatrixService.matrix.map((lessons, day) => lessons.map((_, slot) => {
            const gradeLessons = this.lessonsService.findLessonsByGradeAndTime(grade, { day, slot } as Time);
            return gradeLessons;
        }));
    }

    getScheduleForTeacher(teacherId: Teacher["id"]) {
        return this.scheduleMatrixService.matrix.map((lessons, day) => lessons.map((_, slot) => {
            const [lesson] = this.lessonsService.lessons
                .filter((l) => l.teacher.id === teacherId && l.time.day === day && l.time.slot === slot);
            return lesson;
        }));
    }

    canSwapLessons(grade: Grade, src: Time, dest: Time) {
        const srcLessons = this.lessonsService.findLessonsByGradeAndTime(grade, src);
        const gradeGroups = this.groupsService.findGradeGroups(grade);
        const srcGroupIds = srcLessons.map((l) => l.group.id);
        const srcGroups = gradeGroups.filter((g) => srcGroupIds.includes(g.id));
        const srcSubject = srcGroups[0].subject;
        if (!srcSubject) {
            return {
                src: {
                    available: false,
                    reason: "Помилка при отриманні предметів"
                },
                dest: {
                    available: false,
                    reason: "Помилка при отриманні предметів"
                }
            };
        }
        const destLessons = this.lessonsService.findLessonsByGradeAndTime(grade, dest);
        const destGroupIds = destLessons.map((l) => l.group.id);
        const destGroups = gradeGroups.filter((g) => destGroupIds.includes(g.id));
        const destSubject = destGroups.length ? destGroups[0].subject : null;

        const doesDestExist = !!destSubject;
        const srcAvailability = this.lessonAvailabilityCheckerService.checkAvailability(srcSubject, dest, true);
        const destAvailability = doesDestExist
            ? this.lessonAvailabilityCheckerService.checkAvailability(destSubject, src, true) : {
                available: true
            };
        return {
            src: srcAvailability,
            dest: destAvailability
        };
    }

    swapLessons(grade: Grade, src: Time, dest: Time) {
        const canSwap = this.canSwapLessons(grade, src, dest);
        if (!canSwap.src.available || !canSwap.dest.available) {
            return;
        }
        const srcLessons = this.lessonsService.findLessonsByGradeAndTime(grade, src);
        const destLessons = this.lessonsService.findLessonsByGradeAndTime(grade, dest);
        srcLessons.forEach((lesson) => {
            this.lessonsService.updateLesson({
                ...lesson,
                time: dest
            });
        });
        destLessons.forEach((lesson) => {
            this.lessonsService.updateLesson({
                ...lesson,
                time: src
            });
        });
    }

    private createLessonsForSubject(subject: Subject) {
        for (let i = 0; i < subject.hours; i++) {
            const lessonTime = this.getFreeLessonTime(subject) ?? this.getFreeLessonTime(subject, true);
            if (!lessonTime) {
                console.log(`No free time for subject ${subject.key} in grade ${subject.grade}`);
                return;
            }
            this.scheduleMatrixService.markSlotAsOccupied(lessonTime.day, lessonTime.slot);
            const subjectGroups = this.groupsService.findGroups(subject.id);
            for (const group of subjectGroups) {
                this.lessonsService.createLesson({
                    time: lessonTime,
                    group,
                    teacher: group.teacher
                });
            }
        }
    }

    private getDaysByPriority(subject: Subject) {
        const subjectGroups = this.groupsService.findGroups(subject.id);
        const teachers = subjectGroups.map((group) => group.teacher);
        const scheduleForTeachers = teachers.map((teacher) => this.getScheduleForTeacher(teacher.id));
        const freeDays = this.scheduleMatrixService.days.filter((day) => {
            const schedulesThisDayForTeachers = scheduleForTeachers.map((schedule) => schedule[day]);
            const emptySlotsThisDayForTeachers = this.scheduleMatrixService.slots
                .filter((lesson) => schedulesThisDayForTeachers.every((schedule) => !schedule[lesson]));
            return emptySlotsThisDayForTeachers.some((slot) => this.scheduleMatrixService.isSlotOccupied(day, slot));
        });
        const numberOfSlotsByDayForTeachers = scheduleForTeachers.map((schedule) => schedule.map((lessons) => lessons
            .filter((lesson) => !!lesson).length));
        const maxSlotsPerDay = this.scheduleMatrixService.days.map((day) => Math.max(...numberOfSlotsByDayForTeachers
            .map((numberOfSlotsByDayForTeacher) => numberOfSlotsByDayForTeacher[day])));

        const daysByPriority = [...this.scheduleMatrixService.daysByPriority].sort((a, b) => {
            if (freeDays.includes(a) && !freeDays.includes(b)) {
                return -1;
            }
            if (freeDays.includes(b) && !freeDays.includes(a)) {
                return 1;
            }
            return maxSlotsPerDay[b] - maxSlotsPerDay[a];
        });
        return daysByPriority;
    }

    private isDayAvailable({ grade }: Subject, day: Day) {
        const totalHours = this.subjectsService.getSubjects({ grade })
            .reduce((acc, s) => acc + (s?.hours ?? 0), 0);
        const averageHours = Math.floor(totalHours / this.scheduleMatrixService.days.length);
        const totalHoursThisDay = this.scheduleMatrixService.slotsByDay(day).filter((lesson) => lesson).length;
        return totalHoursThisDay <= averageHours + this.MAX_HOURS_DIFFERENCE;
    }

    private getFreeLessonTime(subject: Subject, checkExtraSlots = false): Time | null {
        const slots = checkExtraSlots ? this.scheduleMatrixService.extraSlots
            : this.scheduleMatrixService.slotsByPriority;
        for (const slot of slots) {
            const daysByPriority = this.getDaysByPriority(subject);
            for (const day of daysByPriority) {
                if (this.isDayAvailable(subject, day)) {
                    const lessonAvailability = this.lessonAvailabilityCheckerService
                        .checkAvailability(subject, { day, slot }, checkExtraSlots);
                    if (lessonAvailability.available) {
                        return { day, slot };
                    }
                }
            }
        }
        return null;
    }
}
