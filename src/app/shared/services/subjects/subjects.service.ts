import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { DataService } from "../data-service/data-service.service";

interface SubjectFilter {
    grade?: Grade;
    key?: Subject["key"];
}

type SubjectConfig = (Omit<Subject, "grade" | "id"> & {
    possibleGrades: Grade[];
})[];
@Injectable({
    providedIn: "root"
})
export class SubjectsService {
    private subjectsConfigSubject: BehaviorSubject<SubjectConfig> = new BehaviorSubject<SubjectConfig>([]);
    subjectsConfig$ = this.subjectsConfigSubject.asObservable();
    private subjectsSubject: BehaviorSubject<Subject[]> = new BehaviorSubject<Subject[]>([]);
    subjects$ = this.subjectsSubject.asObservable();
    private subjectsUrl = "subjects";

    constructor(
        private dataService: DataService,
    ) {
    }

    get subjectsConfig() {
        return this.subjectsConfigSubject.value;
    }

    fetchSubjects() {
        this.dataService.fetchData<Subject[]>(this.subjectsUrl).subscribe({
            next: (subjects) => {
                this.subjectsSubject.next(subjects);
            },
        });
    }

    fetchSubjectsConfig() {
        return this.dataService.fetchData<SubjectConfig>(`${this.subjectsUrl}/config`).subscribe({
            next: (config) => {
                this.subjectsConfigSubject.next(config);
            },
        });
    }

    deleteSubject(subjectId: Subject["id"]) {
        this.dataService.deleteData(`${this.subjectsUrl}/${subjectId}`).subscribe({
            next: () => {
                this.subjectsSubject.next(this.subjectsSubject.value.filter((subject) => subject.id !== subjectId));
            },
        });
    }

    deleteSubjects(subjects: Subject[]) {
        for (const subject of subjects) {
            this.deleteSubject(subject.id);
        }
    }

    getSubjectById(subjectId: Subject["id"]) {
        return this.subjectsSubject.value.find((subject) => subject.id === subjectId);
    }

    createSubject(subject: Omit<Subject, "id">) {
        this.dataService.postData<Omit<Subject, "id">, Subject>(this.subjectsUrl, subject).subscribe({
            next: (s) => {
                this.subjectsSubject.next([...this.subjectsSubject.value, s]);
            },
        });
    }

    createSubjects(subjects: Omit<Subject, "id">[]) {
        for (const subject of subjects) {
            this.createSubject(subject);
        }
    }

    updateSubject(subject: Subject) {
        this.dataService.putData<Subject, Subject>(`${this.subjectsUrl}/${subject.id}`, subject).subscribe({
            next: (s) => {
                this.subjectsSubject.next(
                    this.subjectsSubject.value.map((sub) => (sub.id === s.id ? s : sub))
                );
            },
        });
    }

    updateSubjects(subjects: Subject[]) {
        for (const subject of subjects) {
            this.updateSubject(subject);
        }
    }

    getSubjectLabelByKey(subjectKey: Subject["key"]) {
        return this.subjectsConfig.find((subject) => subject.key === subjectKey)?.label;
    }

    getMaxGroupNumber(grade: Grade) {
        return this.subjectsSubject.value
            .filter((subject) => subject.grade === grade)
            .reduce((max, subject) => Math.max(max, subject.groupNumber), 0);
    }

    getSubjects(filter?: SubjectFilter, params?: { sortByDifficulty: boolean }) {
        let subjects = this.subjectsSubject.value;
        if (params?.sortByDifficulty) {
            subjects = subjects.sort((a, b) => b.difficulty - a.difficulty);
        }
        if (!filter) {
            return subjects;
        }
        const {
            grade, key
        } = filter;
        subjects = this.subjectsSubject.value.filter((subject) => {
            if (grade && subject.grade !== grade) {
                return false;
            }
            if (key && subject.key !== key) {
                return false;
            }
            return true;
        });
        return subjects;
    }

    getSubjectByKeyAndGrade(key: Subject["key"], grade: Grade) {
        return this.subjectsSubject.value.find((subject) => subject.key === key && subject.grade === grade);
    }
}
