import { Injectable } from '@angular/core';
import config from "./subjects.config";
import {GradesService} from "./grades.service";

@Injectable({
  providedIn: 'root'
})
export class SubjectsService {
  private defaultSubjects = config.defaultSubjects
  private allSubjects = config.allSubjects

  private gradesSubjects: Record<Grade, Subject[]> | null = null;

  saveSubjects(grade: Grade, subjects: Subject[]) {
    if (this.gradesSubjects === null) {
      this.gradesSubjects = {} as Record<Grade, Subject[]>;
    }
    if (!this.gradesSubjects[grade]) {
      this.gradesSubjects[grade] = [];
    }
    this.gradesSubjects[grade] = subjects;
  }

  constructor(private gradesService: GradesService) {
  }


  getAllSubjects() {
    return this.allSubjects;
  }

  getSubjects(grade: Grade) {
    if (this.gradesSubjects && this.gradesSubjects[grade] && this.gradesSubjects[grade].length > 0) {
      return this.gradesSubjects[grade];
    }
    const gradeNumberKey = parseInt(grade).toString();
    if (!this.gradesService.isGrade(gradeNumberKey)) {
      throw new Error('Invalid grade');
    }
    return this.defaultSubjects[gradeNumberKey];
  }

}
