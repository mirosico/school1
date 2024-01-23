import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {GradesService} from "./grades.service";
import {MatStepperModule} from "@angular/material/stepper";
import {GradesParallelsComponent} from "./grades-parallels/grades-parallels.component";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-grades',
  standalone: true,
  imports: [
    MatStepperModule,
    GradesParallelsComponent,
    MatButtonModule
  ],
  templateUrl: './grades.component.html',
  styleUrl: './grades.component.scss'
})

export class GradesComponent {
  grades: string[] = [];
  parallelsControls: FormGroup = new FormGroup({});

  getParallelsControlGroup() {
    return new FormGroup(this.grades.reduce(
      (acc, grade) => ({
        ...acc,
        [grade]: new FormControl(null, Validators.required),
      }),
      {}
    ));
  }

  constructor(private gradesService: GradesService) {
    this.grades = this.gradesService.grades;
    this.parallelsControls = this.getParallelsControlGroup();
  }

  onOpenSubjects() {
    console.log(this.parallelsControls.getRawValue());
  }
}
