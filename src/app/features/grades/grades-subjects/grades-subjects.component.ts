import { AsyncPipe } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { BehaviorSubject } from "rxjs";

import type { GradesService } from "../../../shared/grades.service";
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
    selectedGradeKey: BehaviorSubject<Grade | null> = new BehaviorSubject<Grade | null>(null);
    grades!: Grade[];

    constructor(private gradesService: GradesService) {
        this.grades = this.gradesService.grades.value;
        if (this.grades.length > 0) {
            this.selectedGradeKey.next(this.grades[0]);
        }
    }

    ngOnInit() {
        this.gradesService.grades.subscribe(
            (grades) => {
                this.grades = grades;
            }
        );
    }
}
