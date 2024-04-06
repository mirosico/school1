import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { ApplicationConfig } from "@angular/core";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { BaseUrlInterceptor } from "./shared/interceptors/base-url.interceptor";

export const appConfig: ApplicationConfig = {
    providers: [provideRouter(routes), provideAnimations(), provideHttpClient(
        withInterceptorsFromDi(),
    ),
    { provide: HTTP_INTERCEPTORS, useClass: BaseUrlInterceptor, multi: true },
    ]
};
