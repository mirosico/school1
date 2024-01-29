import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class TeachersService {
    teachers = new BehaviorSubject<Teacher[]>([]);

    createTeachers(teacherNames: string[]) {
        const teachers = teacherNames.map((name) => ({
            id: Math.random().toString(16),
            name
        }));
        this.teachers.next(teachers);
    }

    getTeacherById(id: Teacher["id"]) {
        return this.teachers.value.find((teacher) => teacher.id === id) ?? null;
    }
}
