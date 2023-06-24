import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AlertStateType } from "src/app/views/dashboard/utils";

@Injectable({
  providedIn: "root",
})
export class AlertService {
  private _alertState$ = new BehaviorSubject<AlertStateType | null>(null);
  public alertState$ = this._alertState$.asObservable();

  constructor() {}

  getState() {
    return this._alertState$.getValue();
  }

  setState(state: AlertStateType) {
    this._alertState$.next(state);
  }

  alert(state: AlertStateType) {
    this.setState(state);
  }

  close() {
    this._alertState$.next(null);
  }

  success(msg?: string, closeDelay?: number) {
    this.setState({
      type: "success",
      msg,
      closeDelay: closeDelay ?? 5000,
    });
  }
  warning(msg: string, closeDelay?: number) {
    this.setState({
      type: "warning",
      msg,
      closeDelay,
    });
  }
  danger(msg: string, closeDelay?: number) {
    this.setState({
      type: "danger",
      msg,
      closeDelay,
    });
  }
  info(msg: string, closeDelay?: number) {
    this.setState({
      type: "info",
      msg,
      closeDelay,
    });
  }
}
