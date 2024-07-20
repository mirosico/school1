import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";

@Injectable({
    providedIn: "root"
})
export class NotificationsService {
    constructor(private snackBar: MatSnackBar) {}

    show(message: string, config?: MatSnackBarConfig) {
        this.snackBar.open(
            message,
            undefined,
            (config ?? { duration: 3000 })
        );
    }
}
