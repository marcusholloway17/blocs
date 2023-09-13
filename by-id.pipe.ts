import { HttpClient } from "@angular/common/http";
import { Pipe, PipeTransform } from "@angular/core";
import { Observable, map } from "rxjs";

@Pipe({
  name: "byId",
})
export class ByIdPipe implements PipeTransform {
  constructor(private http: HttpClient) {}

  transform(
    value: string | number,
    url: string,
    columns?: string[],
    params?: any
  ): Observable<any | string> {
    const apiUrl = `${url}${value}`;
    return this.http.get(apiUrl, { params: params }).pipe(
      map((data: any) => {
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
