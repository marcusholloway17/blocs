import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject, tap } from "rxjs";
import { AppUIStateProvider } from "src/app/views/partial/ui-state/core";
import { environment } from "src/environments/environment";
import { AlertService } from "../alert/alert.service";

@Injectable({
  providedIn: "root",
})
export class PasswordCheckerService {
  private url: string = `${environment.auth.host}api/user/check-password/`;
  private _authorized$ = new Subject<boolean>();
  private _processCheck$ = new BehaviorSubject<boolean>(false);
  public authorized$ = this._authorized$.asObservable();
  public processCheck$ = this._processCheck$.asObservable();

  constructor(
    private http: HttpClient,
    private UIState: AppUIStateProvider,
    private alert$: AlertService
  ) {}

  setURL(url: string) {
    this.url = url;
    return this;
  }

  check(data: { password: string }) {
    this.UIState.startAction();
    return this.http.post<boolean>(this.url, data).pipe(
      tap((res) => {
        this._authorized$.next(res);
        if (res === true) {
          this.close();
        } else {
          this.alert$.danger(
            "Mot de passe incorrecte, réessayer s'il vous plaît !",
            5000
          );
        }
        this.UIState.endAction();
      })
    );
  }

  process() {
    this._processCheck$.next(true);
  }

  close() {
    this._processCheck$.next(false);
  }
}
