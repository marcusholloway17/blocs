import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
export interface FormState {
  item_id?: number | string;
  updating?: boolean;
}

// helper to check the state of form. it help to know if user is performing update action
@Injectable({
  providedIn: 'root',
})
export class FormStateService {
  public state$ = new Subject<FormState>();
  public currentState = this.state$.asObservable();
  public defaultState: FormState = {
    updating: false,
  };
  constructor() {}

  setState(state: FormState) {
    this.state$.next(state);
  }

  editing(item: any) {
    this.setState({ item_id: item?.id, updating: true });
  }

  resetState() {
    this.state$.next(this.defaultState);
  }
}
