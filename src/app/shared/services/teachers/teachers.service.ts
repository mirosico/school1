import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { DataService } from "../data-service/data-service.service";
import { NotificationsService } from "../notifications/notifications.service";

@Injectable({
    providedIn: "root"
})
export class TeachersService {
    private teachersSubject = new BehaviorSubject<Teacher[]>([]);
    teachers$ = this.teachersSubject.asObservable();
    private readonly teachersUrl = "teachers";

    constructor(private dataService: DataService, private notificationsService: NotificationsService) {
    }

    fetchTeachers() {
        this.dataService.fetchData<Teacher[]>(this.teachersUrl).subscribe({
            next: (teachers) => {
                this.teachersSubject.next(teachers);
            },
        });
    }

    createTeachers(teacherNames: string[]) {
        const teachers = teacherNames.map((name) => ({
            name
        }));
        this.dataService.postData<Partial<Teacher>[], Teacher[]>(this.teachersUrl, teachers)
            .subscribe({
                next: (ts) => {
                    this.teachersSubject.next(ts);
                },
            });
    }

    findTeacherById(id: Teacher["id"]) {
        return this.teachersSubject.value.find((t) => t.id === id);
    }

    updateTeacher(teacherToUpdate: Teacher) {
        this.dataService.putData<Teacher, Teacher>(`${this.teachersUrl}/${teacherToUpdate.id}`, teacherToUpdate)
            .subscribe({
                next: (teacher) => {
                    this.teachersSubject.next(
                        this.teachersSubject.value.map((t) => (t.id === teacher.id ? teacher : t))
                    );
                },
            });
    }

    isBusy(teacherId: Teacher["id"], time: Time) {
        const teacher = this.findTeacherById(teacherId);
        if (!teacher) {
            return false;
        }
        return teacher.notAvailable?.some((blockedTime) => blockedTime.day === time.day
          && blockedTime.slot === time.slot);
    }
}
