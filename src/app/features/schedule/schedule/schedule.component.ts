import { AsyncPipe } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatTabsModule } from "@angular/material/tabs";
import { BehaviorSubject } from "rxjs";

import { GradesScheduleComponent } from "../grades-schedule/grades-schedule.component";
import { TeachersScheduleComponent } from "../teachers-schedule/teachers-schedule.component";

@Component({
    selector: "app-schedule",
    standalone: true,
    imports: [
        MatTabsModule,
        GradesScheduleComponent,
        TeachersScheduleComponent,
        MatInputModule,
        AsyncPipe,
        FormsModule,
        MatButtonModule
    ],
    templateUrl: "./schedule.component.html",
    styleUrl: "./schedule.component.scss"
})
export class ScheduleComponent {
    searchValue = new BehaviorSubject<string>("");

    onSearchChange(value: string) {
        this.searchValue.next(value);
    }
}
