import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { Router } from "@angular/router";

import { UsersService } from "../../services/users/users.service";

type TopBarItem = {
    name: string;
    path: string;
    spacer?: boolean;
    onClick?: () => void;
};

@Component({
    selector: "app-topbar",
    standalone: true,
    imports: [
        MatToolbarModule,
        MatIconModule,
        MatButtonModule
    ],
    templateUrl: "./topbar.component.html",
    styleUrl: "./topbar.component.scss"
})
export class TopbarComponent {
    isUserLoggedIn: boolean = false;

    constructor(
        private router: Router,
        private usersService: UsersService
    ) {
    }

    createMenuItems = () => [
        ...(!this.isUserLoggedIn ? [{
            name: "Вхід",
            path: "login",
            spacer: true
        }, {
            name: "Реєстрація",
            path: "register"
        }
        ] : [{
            name: "Класи",
            path: "grades"
        }, {
            name: "Предмети",
            path: "grades-subjects"
        }, {
            name: "Вчителі",
            path: "teachers"
        }, {
            name: "Забронювати час",
            path: "teachers-blocked-time"
        }, {
            name: "Вчителі/Предмети",
            path: "teachers-subjects"
        }, {
            name: "Вчителі/Класи",
            path: "teachers-grades"
        }, {
            name: "Розклад",
            path: "schedule"
        },
        {
            name: "Вихід",
            path: "logout",
            spacer: true,
            onClick: () => this.logout()
        }])
    ];

    topBarItems: TopBarItem[] = this.createMenuItems();

    ngOnInit() {
        this.usersService.isUserLoggedIn$.subscribe((isUserLoggedIn) => {
            this.isUserLoggedIn = isUserLoggedIn;
            this.topBarItems = this.createMenuItems();
        });
    }

    navigateTo(path: string) {
        this.router.navigate([path]);
    }

    logout() {
        this.usersService.logoutUser();
        this.router.navigate(["login"]);
    }
}
