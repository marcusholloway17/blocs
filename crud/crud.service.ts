import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, map, tap, throwError } from "rxjs";
import { AppUIStateProvider } from "src/app/views/partial/ui-state/core";
import { NotificationService } from "../utils/notification.service";

@Injectable()
export class CrudService {
  private url!: string;
  public _data$ = new BehaviorSubject<any[]>([]);
  public data$ = this._data$.asObservable();

  constructor(
    private http: HttpClient,
    private UIState: AppUIStateProvider,
    private notif$: NotificationService
  ) {}

  setURL(url: string) {
    this.url = url;
    return this;
  }

  create(data: any) {
    this.UIState.startAction();
    return this.http.post(this.url, data).pipe(
      catchError((err) => {
        this.UIState.endAction();
        return throwError(() => err);
      }),
      tap((data) => {
        let currentState = this.currentState();
        currentState.unshift(data);
        this.setState(currentState);
      }),
      tap(() => this.notif$.success())
    );
  }

  update(id: any, data: any) {
    this.UIState.startAction();
    return this.http.put(this.url + id, data).pipe(
      catchError((err) => {
        this.UIState.endAction();
        return throwError(() => err);
      }),
      tap((result) => {
        let currentState = this.currentState();
        currentState.splice(
          currentState.findIndex((e) => e.id === id),
          1,
          result
        );
        this.setState(currentState);
      }),
      tap(() => this.notif$.success())
    );
  }

  getById(id: any, data?: any) {
    return this.http.get(this.url + id, { params: data });
  }

  getAll(data?: any) {
    this.UIState.startAction();
    return this.http.get(this.url, { params: data }).pipe(
      catchError((err) => {
        this.UIState.endAction();
        return throwError(() => err);
      }),
      map((res: any) => res?.data),
      map((data: any) => data?.reverse()),
      tap((result) => this._data$.next(result)),
      tap(() => this.UIState.endAction())
    );
  }

  delete(data: any) {
    this.UIState.startAction();
    return this.http.delete(this.url + data?.id).pipe(
      catchError((err) => {
        this.UIState.endAction();
        return throwError(() => err);
      }),
      tap((res) => {
        let currentState = this.currentState();
        currentState.splice(currentState.indexOf(data), 1);
        this.setState(currentState);
      }),
      tap(() => this.notif$.success())
    );
  }

  setState(state: any) {
    this._data$.next(state);
  }

  currentState() {
    return this._data$.getValue();
  }
}
