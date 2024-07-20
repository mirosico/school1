import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";

import { DataService } from "../data-service/data-service.service";

@Injectable({
    providedIn: "root"
})
export class UsersService {
    private readonly sessionStorageKey = "userId";
    private readonly usersPath = "users";
    private isUserLoggedInSubject = new BehaviorSubject(sessionStorage.getItem(this.sessionStorageKey) !== null);
    isUserLoggedIn$ = this.isUserLoggedInSubject.asObservable();

    constructor(private dataService: DataService, private router: Router) { }

    registerUser(user: User) {
        return this.dataService
            .postData<User, User>(`${this.usersPath}/signup`, user).subscribe({
            next: () => {
                this.router.navigate(["/login"]);
            }
        });
    }

    loginUser(user: User) {
        return this.dataService
            .postData<User, User>(`${this.usersPath}/signin`, user).subscribe({
            next: () => {
                sessionStorage.setItem(this.sessionStorageKey, user.login);
                this.isUserLoggedInSubject.next(true);
                this.router.navigate(["/"]);
            }
        });
    }

    logoutUser() {
        return this.dataService.postData<null, null>(`${this.usersPath}/signout`, null).subscribe({
            next: () => {
                sessionStorage.removeItem(this.sessionStorageKey);
                this.isUserLoggedInSubject.next(false);
                this.router.navigate(["/login"]);
            }
        });
    }
}
