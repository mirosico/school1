import { Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";

import { NotificationsService } from "../../shared/services/notifications/notifications.service";
import { UsersService } from "../../shared/services/users/users.service";

@Component({
    selector: "app-register",
    standalone: true,
    imports: [
        MatInputModule,
        ReactiveFormsModule,
        MatButtonModule
    ],
    templateUrl: "./register.component.html",
    styleUrl: "./register.component.scss"
})
export class RegisterComponent {
    form: FormGroup = new FormGroup({
        login: new FormControl(""),
        password: new FormControl(""),
        confirmPassword: new FormControl("")
    });

    constructor(private usersService: UsersService, private notificationService: NotificationsService) {
    }

    submit(event: Event) {
        event.preventDefault();
        if (this.form.value.password !== this.form.value.confirmPassword) {
            this.notificationService.show("Passwords do not match");
            return;
        }
        if (this.form.valid) {
            this.usersService.registerUser({
                login: this.form.value.login,
                password: this.form.value.password
            });
        }
    }
}
