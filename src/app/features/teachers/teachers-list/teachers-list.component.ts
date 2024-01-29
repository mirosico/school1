import { Component } from "@angular/core";
import {
    FormControl, FormsModule, ReactiveFormsModule, Validators
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Router } from "@angular/router";

import { TeachersService } from "../../../shared/teachers.service";

@Component({
    selector: "app-teachers-list",
    standalone: true,
    imports: [
        MatFormFieldModule,
        FormsModule,
        MatInputModule,
        MatButtonModule,
        ReactiveFormsModule
    ],
    templateUrl: "./teachers-list.component.html",
    styleUrl: "./teachers-list.component.scss"
})
export class TeachersListComponent {
    teachersNames = new FormControl<string | null>(null, [Validators.required]);

    constructor(private readonly teachersService: TeachersService, private readonly router: Router) {
    }

    save() {
        if (this.teachersNames.valid && this.teachersNames.value) {
            const teachersNamesArray = this.teachersNames.value
                .split("\n").map((name) => name.trim()).filter((name) => name.length > 0);
            this.teachersService.createTeachers(teachersNamesArray);
            this.router.navigate(["/teachers-blocked-time"]);
        }
    }
}
