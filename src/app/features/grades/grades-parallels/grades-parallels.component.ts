import {Component, EventEmitter, Output} from '@angular/core';
import {MatListModule} from "@angular/material/list";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {GradesService} from "../../../shared/grades.service";
import {ParallelsService} from "../../../shared/parallels.service";
import {MatButtonModule} from "@angular/material/button";
import {MatStepperModule} from "@angular/material/stepper";

@Component({
  selector: 'app-grades-parallels',
  standalone: true,
  imports: [
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    MatStepperModule,
  ],
  templateUrl: './grades-parallels.component.html',
  styleUrl: './grades-grades-parallels.component.scss'
})
export class GradesParallelsComponent {
  parallels: Parallel[] = [];
  grades: Grade[] = [];
  formGroup!: FormGroup<GradesFormControls>;

  isFormGroupValid() {
    return this.formGroup.valid && !this.formGroup.pending && !this.formGroup.disabled;
  }

  @Output()
  onSubmit = new EventEmitter<Record<Grade, Parallel>>();

  constructor(private gradesService: GradesService, private parallelsService: ParallelsService) {
    this.parallels = this.parallelsService.getParallels();
    this.grades = this.gradesService.getDefaultGrades();
  }

  ngOnInit() {
    this.formGroup =  new FormGroup<GradesFormControls>(this.grades.reduce(
        (acc, grade) => ({
          ...acc,
          [grade]: new FormControl<Parallel | null>(null, Validators.required),
        }),
        {}
      ) as GradesFormControls);
  }

  save() {
    if (this.isFormGroupValid()) {
      const grades = this.parallelsService.convertParallelsToGrades(this.formGroup.value as Record<Grade, Parallel>);
      this.gradesService.grades.next(grades);
    }
  }
}
