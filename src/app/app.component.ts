import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { Component } from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterOutlet } from "@angular/router";
import { Subscription } from "rxjs";

import { TeachersListComponent } from "./features/teachers/teachers-list/teachers-list.component";
import { FooterComponent } from "./shared/components/footer/footer.component";
import { TopbarComponent } from "./shared/components/topbar/topbar.component";
import { DataService } from "./shared/services/data-service/data-service.service";
import { GradesService } from "./shared/services/grades/grades.service";
import { GroupsService } from "./shared/services/groups/groups.service";
import { LessonsService } from "./shared/services/lessons/lessons.service";
import { SubjectsService } from "./shared/services/subjects/subjects.service";
import { TeachersService } from "./shared/services/teachers/teachers.service";
import { UsersService } from "./shared/services/users/users.service";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        TeachersListComponent,
        MatCheckboxModule,
        MatTooltipModule,
        TopbarComponent,
        FooterComponent,
        HttpClientModule,
        MatProgressSpinnerModule],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss"
})
export class AppComponent {
    title = "school1";
    isLoading = false;
    isLoadingSubscription!: Subscription;
    isUserLoggedInSubscription!: Subscription;

    constructor(
        private dataService: DataService,
        private teachersService: TeachersService,
        private gradesService: GradesService,
        private subjectsService: SubjectsService,
        private lessonsService: LessonsService,
        private groupsService: GroupsService,
        private usersService: UsersService,
    ) {
    }

    fetchInitialData() {
        this.gradesService.fetchGrades();
        this.subjectsService.fetchSubjects();
        this.subjectsService.fetchSubjectsConfig();
        this.teachersService.fetchTeachers();
        this.groupsService.fetchGroups();
        this.lessonsService.fetchLessons();
    }

    ngOnInit() {
        this.isUserLoggedInSubscription = this.usersService.isUserLoggedIn$.subscribe((isUserLoggedIn) => {
            if (isUserLoggedIn) {
                this.fetchInitialData();
            }
        });
        this.isLoadingSubscription = this.dataService.isLoading$.subscribe((isLoading) => {
            this.isLoading = isLoading;
        });
    }

    ngOnDestroy() {
        this.isLoadingSubscription.unsubscribe();
        this.isUserLoggedInSubscription.unsubscribe();
    }
}
