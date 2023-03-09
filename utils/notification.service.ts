import { Injectable } from '@angular/core';
import { httpResponses } from 'src/app/views/dashboard/httpResponses';
import {
  AppUIStateProvider,
  UIStateStatusCode,
} from 'src/app/views/partial/ui-state/core';

// helper to send notification to user UI
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private UIState: AppUIStateProvider) {}

  error(error: any) {
    for (const key in error.error) {
      this.UIState.endAction(error.error[key][0], UIStateStatusCode.ERROR);
    }
  }

  success(message?: string) {
    this.UIState.endAction(
      message || httpResponses.fr.successfull_operation,
      UIStateStatusCode.OK
    );
  }
}
