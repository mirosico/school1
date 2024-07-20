import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
    BehaviorSubject, catchError, finalize, tap
} from "rxjs";

import { NotificationsService } from "../notifications/notifications.service";

@Injectable({
    providedIn: "root",
})
export class DataService {
    private isLoadingSubject = new BehaviorSubject<boolean>(false);
    isLoading$ = this.isLoadingSubject.asObservable();

    constructor(
        private http: HttpClient,
        private notificationsService: NotificationsService
    ) {
    }

    fetchData<T>(url: string) {
        return this.http.get<T>(url).pipe(
            tap(() => {
                this.isLoadingSubject.next(true);
            }),
            catchError((error) => {
                this.notificationsService.show(error.message);
                throw error;
            }),
            finalize(() => {
                this.isLoadingSubject.next(false);
            })
        );
    }

    postData<T, D>(url: string, data: T) {
        this.isLoadingSubject.next(true);
        return this.http.post<D>(url, data)
            .pipe(
                finalize(() => {
                    this.isLoadingSubject.next(false);
                }),
                catchError((error) => {
                    this.notificationsService.show(error.message);
                    throw error;
                }),
            );
    }

    deleteData(url: string) {
        return this.http.delete(url).pipe(
            tap(() => {
                this.isLoadingSubject.next(true);
            }),
            catchError((error) => {
                this.notificationsService.show(error.message);
                throw error;
            }),
            finalize(() => {
                this.isLoadingSubject.next(false);
            })
        );
    }

    putData<T, D>(url: string, data: T) {
        return this.http.put<D>(url, data).pipe(
            tap(() => {
                this.isLoadingSubject.next(true);
            }),
            catchError((error) => {
                this.notificationsService.show(error.message);
                throw error;
            }),
            finalize(() => {
                this.isLoadingSubject.next(false);
            })
        );
    }
}
