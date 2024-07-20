import { Component } from "@angular/core";
import {
    FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatListModule } from "@angular/material/list";
import { MatSelectModule } from "@angular/material/select";
import { MatSliderModule } from "@angular/material/slider";
import { MatStepperModule } from "@angular/material/stepper";
import { BehaviorSubject } from "rxjs";

import { GradesService } from "../../../shared/services/grades/grades.service";
import { ParallelsService } from "../../../shared/services/parallels/parallels.service";

type GradesFormControls = {
    [key in Grade]: FormControl<Parallel | null>;
};

@Component({
    selector: "app-grades-parallels",
    standalone: true,
    imports: [
        MatListModule,
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatButtonModule,
        MatStepperModule,
        MatSliderModule,
    ],
    templateUrl: "./grades-parallels.component.html",
    styleUrl: "./grades-parallels.component.scss"
})
export class GradesParallelsComponent {
    parallels = this.parallelsService.parallels;
    gradeNumbers: GradeNumber[] = [];
    grades: Grade[] = [];
    formGroup!: FormGroup<GradesFormControls>;
    gradeRangeSubject = new BehaviorSubject<[number, number]>([5, 11]);

    constructor(
        private gradesService: GradesService,
        private parallelsService: ParallelsService,
    ) {
    }

    onMinGradeChange(event: Event) {
        this.gradeRangeSubject.next(
            [parseInt((event.target as HTMLInputElement).value, 10), this.gradeRangeSubject.value[1]]
        );
    }

    onMaxGradeChange(event: Event) {
        this.gradeRangeSubject.next(
            [this.gradeRangeSubject.value[0], parseInt((event.target as HTMLInputElement).value, 10)]
        );
    }

    isFormGroupValid() {
        return this.formGroup.valid && !this.formGroup.pending && !this.formGroup.disabled;
    }

    ngOnInit() {
        this.gradesService.grades$.subscribe((g) => {
            const grades = g.length ? g : this.gradesService.gradeNumbers;
            const gradeNumbers = Array.from(new Set(grades
                .map((grade) => parseInt(grade, 10))));
            this.gradeNumbers = gradeNumbers.map((grade) => grade.toString() as GradeNumber);
            this.grades = grades;
            this.gradeRangeSubject.next([Math.min(...gradeNumbers), Math.max(...gradeNumbers)]);
            this.createFormGroup();
        });
        this.gradeRangeSubject.subscribe(([min, max]) => {
            this.gradeNumbers = Array.from({ length: max - min + 1 }, (_, i) => i + min) as unknown as GradeNumber[];
            this.createFormGroup();
        });
    }

    createFormGroup() {
        this.formGroup = new FormGroup<GradesFormControls>(this.gradeNumbers.reduce(
            (acc, grade) => ({
                ...acc,
                [grade]: new FormControl<Parallel | null>(null, Validators.required),
            }),
            {}
        ) as GradesFormControls);
    }

    save() {
        if (this.isFormGroupValid()) {
            this.gradesService.createGrades(this.formGroup.value as Record<Grade, Parallel>);
        }
    }
}
