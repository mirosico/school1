import { AsyncPipe } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { BehaviorSubject } from "rxjs";

import { GradesService } from "../../../shared/services/grades/grades.service";
import { GradeSubjectsComponent } from "./grade-subjects/grade-subjects.component";

@Component({
    selector: "app-grades-subjects",
    standalone: true,
    imports: [
        MatSelectModule,
        GradeSubjectsComponent,
        FormsModule,
        AsyncPipe,
        MatButtonModule,
    ],
    templateUrl: "./grades-subjects.component.html",
    styleUrl: "./grades-subjects.component.scss"
})
export class GradesSubjectsComponent {
    grades = this.gradesService.grades;
    selectedGradeKey: BehaviorSubject<Grade | null> = new BehaviorSubject<Grade | null>(this.grades[0] ?? null);

    constructor(
        private gradesService: GradesService,
    ) {
    }
}
