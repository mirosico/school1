import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { DataService } from "../data-service/data-service.service";
import { SubjectsService } from "../subjects/subjects.service";

@Injectable({
    providedIn: "root"
})
export class GroupsService {
    private groupsSubject = new BehaviorSubject<SubjectGroup[]>([]);
    groups$ = this.groupsSubject.asObservable();

    constructor(private dataService: DataService, private subjectsService: SubjectsService) {
    }

    getGroups() {
        return this.groupsSubject.value;
    }

    fetchGroups() {
        this.dataService.fetchData<SubjectGroup[]>("groups").subscribe({
            next: (groups) => {
                this.groupsSubject.next(groups);
            },
        });
    }

    createGroup(group: Omit<SubjectGroup, "id">) {
        this.dataService.postData<Omit<SubjectGroup, "id">, SubjectGroup>("groups", group).subscribe({
            next: (g) => {
                this.groupsSubject.next([...this.groupsSubject.value, g]);
            },
        });
    }

    deleteGroup(groupId: SubjectGroup["id"]) {
        this.dataService.deleteData(`groups/${groupId}`).subscribe({
            next: () => {
                this.groupsSubject.next(this.groupsSubject.value.filter((group) => group.id !== groupId));
            },
        });
    }

    updateGroup(groupToUpdate: SubjectGroup) {
        this.dataService.putData<SubjectGroup, SubjectGroup>(`groups/${groupToUpdate.id}`, groupToUpdate).subscribe({
            next: (group) => {
                this.groupsSubject.next(
                    this.groupsSubject.value.map((g) => (g.id === group.id ? group : g))
                );
            },
        });
    }

    findGradeGroups(grade: Grade) {
        const gradeSubjects = this.subjectsService.getSubjects({ grade });
        return gradeSubjects.flatMap((s) => this.findGroups(s.id));
    }

    findGroups(subjectId?: Subject["id"], teacherId?: Teacher["id"], groupNumber?: number) {
        return this.groupsSubject.value
            .filter((group) => (!subjectId || group.subject.id === subjectId)
              && (!teacherId || group.teacher.id === teacherId) && (!groupNumber || group.group === groupNumber));
    }
}
