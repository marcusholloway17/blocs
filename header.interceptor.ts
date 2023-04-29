import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpHeaders,
} from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (
      !/(api\/v2\/login)|(api\/v2\/logout|(api\/v2\/user))/.test(request.url)
    ) {
      const headers = new HttpHeaders().set(
        "authorization",
        request.headers.get("authorization") || ""
      );
      request = request.clone({ headers });
    }
    return next.handle(request);
  }
}

export const HeaderInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: HeaderInterceptor,
  multi: true,
};
