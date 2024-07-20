import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

import { UsersService } from "../services/users/users.service";

@Injectable({
    providedIn: "root"
})
export class AuthGuard implements CanActivate {
    isUserLoggedIn: boolean = false;
    constructor(private userService: UsersService, private router: Router) {
        this.userService.isUserLoggedIn$.subscribe({
            next: (isUserLoggedIn) => {
                this.isUserLoggedIn = isUserLoggedIn;
            }
        });
    }

    canActivate(): boolean {
        if (this.isUserLoggedIn) {
            return true;
        }
        this.router.navigate(["/login"]);
        return false;
    }
}
