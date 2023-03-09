import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ConfirmationService } from './confirmation.service';

export interface Confirmation {
  type?: string;
  title?: string;
  message?: string;
  data?: any;
  opened: boolean;
}

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css'],
})
export class ConfirmationComponent implements OnInit {
  public confirmation: Confirmation = {
    title: 'CONFIRMER VOTRE ACTION',
    data: null,
    opened: false,
  };

  @Output() confirm: EventEmitter<any> = new EventEmitter();
  constructor(private confirmationService: ConfirmationService) {}

  ngOnInit(): void {
    this.setState();
  }

  setState() {
    this.confirmationService.confirmationState$.subscribe(
      (state: Confirmation) => {
        this.confirmation = { ...this.confirmation, ...state };
      }
    );
  }

  onConfirm() {
    this.confirm.emit(this.confirmation.data);
    this.resetState();
  }

  onReject() {
    this.resetState();
  }

  resetState() {
    this.confirmation = {
      title: 'CONFIRMER VOTRE ACTION',
      data: null,
      opened: false,
    };
  }
}
