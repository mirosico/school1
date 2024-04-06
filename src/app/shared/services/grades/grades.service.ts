import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { DataService } from "../data-service/data-service.service";
import { ParallelsService } from "../parallels/parallels.service";

interface GradeObject {
    grade: Grade;
}

@Injectable({
    providedIn: "root"
})
export class GradesService {
    private gradesSubject = new BehaviorSubject<Grade[]>([]);
    grades$ = this.gradesSubject.asObservable();
    #gradeNumbers: GradeNumber[] = ["5", "6", "7", "8", "9", "10", "11"];

    constructor(private parallelsService: ParallelsService, private dataService: DataService) {
        this.fetchGrades();
    }

    get grades() {
        return this.gradesSubject.value;
    }

    get gradeNumbers() {
        return this.#gradeNumbers;
    }

    fetchGrades() {
        this.dataService.fetchData<GradeObject[]>("grades").subscribe({
            next: (grades) => {
                this.gradesSubject.next(grades.map((g) => g.grade));
            },
        });
    }

    isGrade(grade: string): grade is Grade {
        return this.gradeNumbers.some((gradeNumber) => grade.startsWith(gradeNumber));
    }

    createGrades(gradesMaxParallel: Record<Grade, Parallel>) {
        const grades = Object.entries(gradesMaxParallel).map(
            ([_grade, parallel]) => {
                const grade = _grade as Grade;
                if (parallel && !this.parallelsService.hasParallel(parallel)) {
                    return grade;
                }
                const result: Grade[] = [];
                const paralles = this.parallelsService.parallels;
                for (let i = 0; i < paralles.length; i++) {
                    result.push(`${grade}${paralles[i]}` as Grade);
                    if (paralles[i] === parallel) {
                        break;
                    }
                }
                return result;
            }
        ).flat();
        const gradesObject: GradeObject[] = grades.map((grade) => ({ grade }));
        this.dataService.postData<GradeObject[], GradeObject[]>("grades", gradesObject).subscribe({
            next: (g) => {
                const newGrades = g.map((grade) => grade.grade);
                this.gradesSubject.next([...this.gradesSubject.value, ...newGrades]);
            },
        });
    }
}
