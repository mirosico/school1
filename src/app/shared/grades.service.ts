import {Injectable} from '@angular/core';
import {ParallelsService} from "./parallels.service";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GradesService {
  private defaultGrades: Grade[] = ['5', '6', '7', '8', '9', '10', '11'];
  grades = new BehaviorSubject<Grade[]>([]);


  constructor(private parallelsService: ParallelsService) {
  }

  getDefaultGrades() {
    return this.defaultGrades;
  }

  isGrade(grade: string): grade is Grade {
    return this.defaultGrades.some((defaultGrade) => grade.startsWith(defaultGrade));
  }

}
