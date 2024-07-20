import { Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";

import { UsersService } from "../../shared/services/users/users.service";

@Component({
    selector: "app-login",
    standalone: true,
    imports: [
        MatInputModule,
        ReactiveFormsModule,
        MatButtonModule
    ],
    templateUrl: "./login.component.html",
    styleUrl: "./login.component.scss"
})
export class LoginComponent {
    form: FormGroup = new FormGroup({
        login: new FormControl(""),
        password: new FormControl(""),
    });

    constructor(private usersService: UsersService) {
    }

    submit(event: Event) {
        event.preventDefault();
        if (this.form.valid) {
            this.usersService.loginUser(this.form.value);
        }
    }
}
