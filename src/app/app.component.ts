import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { Component } from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterOutlet } from "@angular/router";
import { Subscription } from "rxjs";

import { TeachersListComponent } from "./features/teachers/teachers-list/teachers-list.component";
import { FooterComponent } from "./shared/components/footer/footer.component";
import { TopbarComponent } from "./shared/components/topbar/topbar.component";
import { DataService } from "./shared/services/data-service/data-service.service";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        TeachersListComponent,
        MatCheckboxModule,
        MatTooltipModule,
        TopbarComponent,
        FooterComponent,
        HttpClientModule,
        MatProgressSpinnerModule],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss"
})
export class AppComponent {
    title = "school1";
    isLoading = false;
    isLoadingSubscription!: Subscription;

    constructor(private dataService: DataService) {
    }

    ngOnInit() {
        this.isLoadingSubscription = this.dataService.isLoading$.subscribe((isLoading) => {
            this.isLoading = isLoading;
        });
    }

    ngOnDestroy() {
        this.isLoadingSubscription.unsubscribe();
    }
}
