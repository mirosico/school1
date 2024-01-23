import {Component, Input} from '@angular/core';
import {MatListModule} from "@angular/material/list";
import {AbstractControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {GradesService} from "../grades.service";

@Component({
  selector: 'app-grades-parallels',
  standalone: true,
  imports: [
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  templateUrl: './grades-parallels.component.html',
  styleUrl: './grades-parallels.component.scss'
})
export class GradesParallelsComponent {
  parallels: string[] = [];

  grades: Grade[] = [];

  @Input({ required: true })
  formGroup!: FormGroup<Grade>;

  constructor(private gradesService: GradesService) {
    this.parallels = this.gradesService.parallels;
    this.grades = this.gradesService.grades;
  }

  ngOnInit() {
    console.log(this.formGroup);
  }
}
