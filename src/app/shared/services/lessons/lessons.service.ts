import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { DataService } from "../data-service/data-service.service";
import { GroupsService } from "../groups/groups.service";

@Injectable({
    providedIn: "root"
})
export class LessonsService {
    private lessonsSubject: BehaviorSubject<Lesson[]> = new BehaviorSubject<Lesson[]>([]);
    lessons$ = this.lessonsSubject.asObservable();

    constructor(private dataService: DataService, private groupsService: GroupsService) {
    }

    get lessons() {
        return this.lessonsSubject.value;
    }

    fetchLessons() {
        this.dataService.fetchData<Lesson[]>("lessons").subscribe({
            next: (lessons) => {
                this.lessonsSubject.next(lessons);
            },
        });
    }

    createLesson(lesson: Omit<Lesson, "id">) {
        this.dataService.postData<Omit<Lesson, "id">, Lesson>("lessons", lesson).subscribe({
            next: (l) => {
                this.lessonsSubject.next([...this.lessonsSubject.value, l]);
            },
        });
    }

    updateLesson(lessonToUpdate: Lesson) {
        this.dataService.putData<Lesson, Lesson>(`lessons/${lessonToUpdate.id}`, lessonToUpdate).subscribe({
            next: () => {
                this.lessonsSubject.next(
                    this.lessonsSubject.value.map((l) => (l.id === lessonToUpdate.id ? lessonToUpdate : l))
                );
            },
        });
    }

    deleteLesson(lessonId: Lesson["id"]) {
        this.dataService.deleteData(`lessons/${lessonId}`).subscribe({
            next: () => {
                this.lessonsSubject.next(this.lessonsSubject.value.filter((lesson) => lesson.id !== lessonId));
            },
        });
    }

    findLessonsByGradeAndTime(grade: Grade, time: Partial<Time>) {
        const gradeGroups = this.groupsService.findGradeGroups(grade);
        const gradeLessons = gradeGroups.flatMap((group) => this.lessonsSubject.value
            .filter((lesson) => lesson.group.id === group.id
        && (time.day === undefined || lesson.time.day === time.day)
        && (time.slot === undefined || lesson.time.slot === time.slot)));
        return gradeLessons;
    }

    findLessons({ teacherId, time }: { teacherId: Teacher["id"]; time: Time }) {
        return this.lessonsSubject.value.filter((lesson) => lesson.teacher.id === teacherId
      && lesson.time.day === time.day
      && lesson.time.slot === time.slot);
    }
}
