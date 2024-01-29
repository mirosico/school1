import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParallelsService {
  readonly withNoParallel = 'Без паралелі';
  private parallels: Parallel[] = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', this.withNoParallel]

  constructor() {
  }

  getParallels() {
    return this.parallels;
  }

  checkHasParallel(parallel: Parallel) {
    return parallel !== this.withNoParallel && this.parallels.includes(parallel) && parallel !== this.parallels[0];
  }

  convertParallelsToGrades(gradesMaxParallel: Record<Grade, Parallel>): Grade[] {
    return Object.entries(gradesMaxParallel).map(
      ([_grade, parallel]) => {
        const grade = _grade as Grade;
        if (parallel && !this.checkHasParallel(parallel)) {
          return grade;
        }
        let result: Grade[] = [];
        const paralles = this.getParallels();
        for (let i = 0; i < paralles.length; i++) {
          result.push(`${grade}${paralles[i]}` as Grade);
          if (paralles[i] === parallel) {
            break;
          }
        }
        return result;
      }
    ).flat();
  }
}
