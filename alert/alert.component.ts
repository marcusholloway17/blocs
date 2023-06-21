import { Component, OnDestroy, OnInit } from "@angular/core";
import { AlertService } from "./alert.service";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-alert",
  templateUrl: "./alert.component.html",
  styleUrls: ["./alert.component.css"],
})
export class AlertComponent implements OnInit, OnDestroy {
  alertState$ = this.alert$.alertState$;
  private destroy$ = new Subject<void>();
  constructor(private alert$: AlertService) {}

  ngOnInit(): void {
    this.alertState$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (value) => {
        if (value?.closeDelay !== undefined) {
          if (value?.closeDelay !== -1) {
            setTimeout(() => {
              this.onClose();
            }, value?.closeDelay);
          }
        }
      },
    });
  }

  onClose() {
    this.alert$.close();
  }

  ngOnDestroy(): void {
    this.onClose();
    this.destroy$.next();
  }
}
