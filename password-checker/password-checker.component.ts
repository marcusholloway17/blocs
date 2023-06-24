import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { PasswordCheckerService } from "./password-checker.service";
import { Subject, takeUntil, tap } from "rxjs";
import { FORM_CLIENT, FormsClient } from "@azlabsjs/ngx-smart-form";

@Component({
  selector: "app-password-checker",
  templateUrl: "./password-checker.component.html",
  styleUrls: ["./password-checker.component.css"],
})
export class PasswordCheckerComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public modal: boolean = false;
  processCheck$ = this.checker$.processCheck$.pipe(
    takeUntil(this.destroy$),
    tap((state) => console.log)
  );
  form$ = this.formsClient.get(341);
  constructor(
    @Inject(FORM_CLIENT) private formsClient: FormsClient,
    private checker$: PasswordCheckerService
  ) {}

  ngOnInit(): void {}

  // checkModalState() {
  //   console.log("init");
  //   this.checker$.processCheck$
  //     .pipe(
  //       takeUntil(this.destroy$),
  //       tap((state) => (this.modal = state))
  //     )
  //     .subscribe();
  // }

  onCancel() {
    this.checker$.close();
  }

  check(event: any) {
    console.log(event);
    this.checker$.check(event).pipe(takeUntil(this.destroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
