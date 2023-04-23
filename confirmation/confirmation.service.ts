import { Injectable } from "@angular/core";
import { Confirmation } from "./confirmation.component";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ConfirmationService {
  public defaultMessage: string =
    "Êtes-vous sûr de vouloir effectuer cette action ?";
  public defaultType: string = "danger";
  public confirmationState = new Subject<Confirmation>();
  public confirmationState$ = this.confirmationState.asObservable();
  constructor() {}

  confirm(data: Confirmation) {
    this.confirmationState.next(data);
    this.close();
  }

  show(data?: any, message?: string, type?: string) {
    this.confirmationState.next({
      data: data,
      type: type || this.defaultType,
      message: message || this.defaultMessage,
      opened: true,
    });
  }

  close() {
    this.reject();
  }

  reject() {
    this.confirmationState.next({ opened: false });
  }
}
