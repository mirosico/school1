import { AsyncPipe } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";

import { TeachersService } from "../../../shared/services/teachers/teachers.service";
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
        TeacherBlockedTimeComponent,
        MatButtonModule
    ],
    templateUrl: "./teachers-blocked-time.component.html",
    styleUrl: "./teachers-blocked-time.component.scss"
})
export class TeachersBlockedTimeComponent {
    selectedTeacherId = new BehaviorSubject<Teacher["id"] | null>(null);
    teachersList!: Teacher[];

    constructor(private teachersService: TeachersService, private router: Router) {
        this.teachersService.teachers$.subscribe((teachers) => {
            this.teachersList = teachers;
            if (this.teachersList.length > 0) {
                this.selectedTeacherId.next(this.teachersList[0].id);
            }
        });
    }

    onSelectedTeacherChange(teacherId: Teacher["id"]) {
        this.selectedTeacherId.next(teacherId);
    }

    save() {
        this.router.navigate(["/teachers-subjects"]);
    }
}
