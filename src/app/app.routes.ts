import { Routes } from "@angular/router";

import { AuthGuard } from "./shared/guards/auth.guard";

export const routes: Routes = [
    {
        path: "teachers",
        canActivate: [AuthGuard],
        loadComponent: () => import("./features/teachers/teachers-list/teachers-list.component").then(
            (m) => m.TeachersListComponent
        ),
    },
    {
        path: "teachers-blocked-time",
        canActivate: [AuthGuard],
        loadComponent: () => import("./features/teachers/teachers-blocked-time/teachers-blocked-time.component").then(
            (m) => m.TeachersBlockedTimeComponent
        ),
    },
    {
        path: "teachers-subjects",
        canActivate: [AuthGuard],
        loadComponent: () => import("./features/teachers/teachers-subjects/teachers-subjects.component").then(
            (m) => m.TeachersSubjectsComponent
        ),
    },
    {
        path: "teachers-grades",
        canActivate: [AuthGuard],
        loadComponent: () => import("./features/teachers/teachers-grades/teachers-grades.component").then(
            (m) => m.TeachersGradesComponent
        ),
    },
    {
        path: "grades",
        canActivate: [AuthGuard],
        loadComponent: () => import("./features/grades/grades-parallels/grades-parallels.component").then(
            (m) => m.GradesParallelsComponent
        ),
    },
    {
        path: "grades-subjects",
        canActivate: [AuthGuard],
        loadComponent: () => import("./features/grades/grades-subjects/grades-subjects.component").then(
            (m) => m.GradesSubjectsComponent
        ),
    },
    {
        path: "schedule",
        canActivate: [AuthGuard],
        loadComponent: () => import("./features/schedule/schedule/schedule.component").then(
            (m) => m.ScheduleComponent
        ),
    }, {
        path: "login",
        loadComponent: () => import("./features/login/login.component").then(
            (m) => m.LoginComponent
        ),
    },
    {
        path: "register",
        loadComponent: () => import("./features/register/register.component").then(
            (m) => m.RegisterComponent
        ),
    },
    {
        path: "",
        redirectTo: "grades",
        pathMatch: "full",
    }
];
