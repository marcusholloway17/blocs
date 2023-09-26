import { HttpClient } from "@angular/common/http";
import { Pipe, PipeTransform } from "@angular/core";
import { Observable, catchError, map, throwError } from "rxjs";
import { AppUIStateProvider } from "../views/partial/ui-state/core";

@Pipe({
  name: "byId",
})
export class ByIdPipe implements PipeTransform {
  constructor(private http: HttpClient, private uistate: AppUIStateProvider) {}

  transform(
    value: string | number,
    url: string,
    columns?: string[],
    params?: any
  ): Observable<any> {
    const apiUrl = `${url}${value}`;
    this.uistate.startAction();

    return this.http.get(apiUrl, { params: params }).pipe(
      catchError((err) => {
        this.uistate.endAction();
        return throwError(() => err);
      }),
      map((data: any) => {
        this.uistate.endAction();
        if (columns) {
          const values = columns.map((column) => data[column]).join(" ");
          return values;
        } else {
          return data;
        }
      })
    );
  }
}
