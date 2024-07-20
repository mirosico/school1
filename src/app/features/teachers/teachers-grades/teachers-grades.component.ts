import { Component } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Router } from "@angular/router";

import { GradesService } from "../../../shared/services/grades/grades.service";
import { GroupsService } from "../../../shared/services/groups/groups.service";
import { ScheduleService } from "../../../shared/services/schedule/schedule.service";
import { SubjectsService } from "../../../shared/services/subjects/subjects.service";
import { TeachersService } from "../../../shared/services/teachers/teachers.service";

@Component({
    selector: "app-teachers-grades",
    standalone: true,
    imports: [
        MatCheckboxModule,
        MatGridListModule,
        MatButtonModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        FormsModule
    ],
    templateUrl: "./teachers-grades.component.html",
    styleUrl: "./teachers-grades.component.scss"
})
export class TeachersGradesComponent {
    teachers: Teacher[] = [];
    grades = this.gradesService.grades;
    searchValue: string = "";
    filteredTeachers = this.teachers;
    subjects: Subject[] = [];

    constructor(
        private teachersService: TeachersService,
        private gradesService: GradesService,
        private subjectsService: SubjectsService,
        private scheduleService: ScheduleService,
        private groupsService: GroupsService,
        private router: Router,
    ) {
    }

    ngOnInit() {
        this.teachersService.teachers$.subscribe((teachers) => {
            this.teachers = teachers;
            this.filteredTeachers = teachers;
        });
        this.subjectsService.subjects$.subscribe((subjects) => {
            this.subjects = subjects;
        });
    }

    onSearchChange(searchValue: string) {
        this.searchValue = searchValue;
        this.filteredTeachers = this.teachers
            .filter((teacher) => teacher.name.toLowerCase().includes(searchValue.toLowerCase()));
    }

    getSubjectLabel(subjectKey: Subject["key"]) {
        return this.subjectsService.getSubjectLabelByKey(subjectKey);
    }

    getMaxGroupNumberArray(grade: Grade) {
        return Array.from(Array(this.subjectsService.getMaxGroupNumber(grade)).keys()).map((i) => i + 1);
    }

    isCheckboxDisabled(grade: Grade, subjectKey: Subject["key"], teacherId: Teacher["id"], groupNumber: number) {
        const subject = this.subjectsService.getSubjectByKeyAndGrade(subjectKey, grade);
        if (!subject) {
            return true;
        }
        const groupExists = !!this.groupsService.findGroups(
            subject.id,
            undefined,
            groupNumber
        ).length;
        return subject.groupNumber < groupNumber
          || (groupExists
            && !this.isCheckboxChecked(grade, subjectKey, teacherId, groupNumber));
    }

    isCheckboxChecked(
        grade: Grade,
        subjectKey: Subject["key"],
        teacherId: Teacher["id"],
        groupNumber: number
    ) {
        const subject = this.subjectsService.getSubjectByKeyAndGrade(subjectKey, grade);
        if (!subject) {
            return false;
        }
        return !!this.groupsService.findGroups(subject.id, teacherId, groupNumber).length;
    }

    getCheckBoxToolTipLabel(
        grade: Grade,
        subjectKey: Subject["key"],
        teacherId: Teacher["id"],
        groupNumber: number
    ) {
        const subject = this.subjectsService.getSubjectByKeyAndGrade(subjectKey, grade);
        if (!subject) {
            return "В цьому класі немає такого предмету";
        }
        if (subject.groupNumber < groupNumber) {
            return "В цьому класі немає такої групи";
        }
        if (!!this.groupsService.findGroups(subject.id, teacherId, groupNumber).length
          && !this.isCheckboxChecked(grade, subjectKey, teacherId, groupNumber)) {
            return "Ця група вже зайнята іншим вчителем";
        }
        return "";
    }

    getTeacherTotalHours(teacherId: Teacher["id"]) {
        const teacherGroups = this.groupsService.findGroups(undefined, teacherId) ?? [];
        return teacherGroups.reduce((sum, group) => {
            const { subject } = group;
            return sum + (subject.hours);
        }, 0);
    }

    getNumberOfCols() {
        return this.grades.reduce((sum, grade) => sum + this.subjectsService.getMaxGroupNumber(grade), 3);
    }

    onCheckboxChange(
        grade: Grade,
        subjectKey: Subject["key"],
        teacherId: Teacher["id"],
        groupNumber: number,
        isCheckboxChecked: boolean
    ) {
        const subject = this.subjectsService.getSubjectByKeyAndGrade(subjectKey, grade);
        if (!subject) {
            return;
        }
        const teacher = this.teachersService.findTeacherById(teacherId);
        if (!teacher) {
            return;
        }
        if (isCheckboxChecked) {
            this.groupsService.createGroup({
                group: groupNumber,
                subject,
                teacher
            });
        } else {
            const group = this.groupsService.findGroups(subject.id, teacherId, groupNumber)[0];
            if (group) {
                this.groupsService.deleteGroup(group.id);
            }
        }
    }

    isSaveButtonDisabled() {
        const numberOfGroupsShouldBe = this.subjects.reduce((sum, subject) => sum + subject.groupNumber, 0);
        const numberOfGroups = this.groupsService.getGroups().length;
        return numberOfGroupsShouldBe !== numberOfGroups;
    }

    save() {
        this.scheduleService.clearSchedule();
        this.scheduleService.generateSchedule();
        this.router.navigate(["/schedule"]);
    }
}
