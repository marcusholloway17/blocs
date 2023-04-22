import { Injectable } from "@angular/core";
import { httpResponses } from "src/app/blocs/httpResponses";
import {
  AppUIStateProvider,
  UIStateStatusCode,
} from "src/app/views/partial/ui-state/core";

// helper to send notification to user UI
@Injectable({
  providedIn: "root",
})
export class NotificationService {
  constructor(private UIState: AppUIStateProvider) {}

  error(error: any) {
    if (error?.errors && error.errors?.length) {
      for (const key in error.errors) {
        this.UIState.endAction(
          error.error[key]["msg"],
          UIStateStatusCode.ERROR
        );
      }
    } else {
      this.UIState.endAction(
        error.error?.message ?? error.error?.msg,
        UIStateStatusCode.ERROR
      );
    }
  }

  success(message?: string) {
    this.UIState.endAction(
      message ?? httpResponses.fr.successfull_operation,
      UIStateStatusCode.OK
    );
  }
}
