import {
    HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {
    private baseUrl: string = "http://localhost:3000/";

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const newRequest = request.clone({
            url: `${this.baseUrl}${request.url}`,
            withCredentials: true,
        });

        return next.handle(newRequest);
    }
}
