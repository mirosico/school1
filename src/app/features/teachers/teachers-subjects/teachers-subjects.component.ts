import { AsyncPipe } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { Router } from "@angular/router";

import { SubjectsService } from "../../../shared/services/subjects/subjects.service";
import { TeachersService } from "../../../shared/services/teachers/teachers.service";

@Component({
    selector: "app-teachers-subjects",
    standalone: true,
    imports: [
        MatSelectModule,
        MatGridListModule,
        FormsModule,
        MatButtonModule,
        MatCheckboxModule,
        AsyncPipe,
        MatInputModule
    ],
    templateUrl: "./teachers-subjects.component.html",
    styleUrl: "./teachers-subjects.component.scss"
})
export class TeachersSubjectsComponent {
    allSubjects = this.subjectsService.subjectsConfig;
    allTeachers: Teacher[] = [];
    filteredTeachers = this.allTeachers;
    searchValue: string = "";

    constructor(
        private subjectsService: SubjectsService,
        private teachersService: TeachersService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.teachersService.teachers$.subscribe((teachers) => {
            this.allTeachers = teachers;
            this.filteredTeachers = teachers;
        });
    }

    onSearchChange(searchValue: string) {
        this.searchValue = searchValue;
        this.filteredTeachers = this.allTeachers
            .filter((teacher) => teacher.name.toLowerCase().includes(searchValue.toLowerCase()));
    }

    onSubjectsChange(teacherId: Teacher["id"], subjects: Subject["key"][]) {
        const teacher = this.teachersService.findTeacherById(teacherId);
        if (teacher) {
            this.teachersService.updateTeacher({
                ...teacher,
                subjectKeys: subjects
            });
        }
    }

    save() {
        this.router.navigate(["/teachers-grades"]);
    }
}
