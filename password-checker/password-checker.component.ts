import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { PasswordCheckerService } from "./password-checker.service";
import { Subject, takeUntil, tap } from "rxjs";
import {
  FORM_CLIENT,
  FormsClient,
  ReactiveFormComponentInterface,
} from "@azlabsjs/ngx-smart-form";

@Component({
  selector: "app-password-checker",
  templateUrl: "./password-checker.component.html",
  styleUrls: ["./password-checker.component.css"],
})
export class PasswordCheckerComponent implements OnInit, OnDestroy {
  form$ = this.formsClient.get(341);
  private destroy$ = new Subject<void>();
  public modal: boolean = false;
  processCheck$ = this.checker$.processCheck$
    .pipe(
      takeUntil(this.destroy$),
      tap((state) => (this.modal = state))
    )
    .subscribe();

  @ViewChild("formvalue", { static: false })
  formvalue!: ReactiveFormComponentInterface;

  constructor(
    @Inject(FORM_CLIENT) private formsClient: FormsClient,
    private checker$: PasswordCheckerService
  ) {}

  ngOnInit(): void {
    this.formvalue?.reset();
  }

  // checkModalState() {
  //   console.log("init");
  //   this.checker$.processCheck$
  //     .pipe(
  //       takeUntil(this.destroy$),
  //       tap((state) => (this.modal = state))
  //     )
  //     .subscribe();
  // }

  onReadyState(state: any) {
    console.log(state);
  }

  onCancel() {
    this.formvalue?.reset();
    this.checker$.close();
  }

  check(event: any) {
    this.checker$.check(event).pipe(takeUntil(this.destroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.formvalue?.reset();
    this.destroy$.next();
  }
}
