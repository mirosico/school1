import { AsyncPipe } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { BehaviorSubject } from "rxjs";

import { TeachersService } from "../../../shared/teachers.service";
import { GradeSubjectsComponent } from "../../grades/grades-subjects/grade-subjects/grade-subjects.component";
import { TeacherBlockedTimeComponent } from "./teacher-blocked-time/teacher-blocked-time.component";

@Component({
    selector: "app-teachers-blocked-time",
    standalone: true,
    imports: [
        AsyncPipe,
        GradeSubjectsComponent,
        MatFormFieldModule,
        MatOptionModule,
        MatSelectModule,
        FormsModule,
        TeacherBlockedTimeComponent
    ],
    templateUrl: "./teachers-blocked-time.component.html",
    styleUrl: "./teachers-blocked-time.component.scss"
})
export class TeachersBlockedTimeComponent {
    selectedTeacherId = new BehaviorSubject<Teacher["id"] | null>(null);
    teachersList!: Teacher[];

    constructor(private teachersService: TeachersService) {
        this.teachersList = this.teachersService.teachers.value;
        if (this.teachersList.length > 0) {
            this.selectedTeacherId.next(this.teachersList[0].id);
        }
    }

    ngOnInit() {
        this.teachersService.teachers.subscribe(
            (teachers) => {
                this.teachersList = teachers;
            }
        );
    }

    onSelectedTeacherChange(teacherId: Teacher["id"]) {
        this.selectedTeacherId.next(teacherId);
    }
}
