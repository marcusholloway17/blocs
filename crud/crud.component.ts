import { formatDate } from "@angular/common";
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { GridColumnType, GridConfigType } from "@azlabsjs/ngx-clr-smart-grid";
import {
  FormsClient,
  FORM_CLIENT,
  ReactiveFormComponentInterface,
} from "@azlabsjs/ngx-smart-form";
import { Observable, Subject, lastValueFrom, map, takeUntil, tap } from "rxjs";
import { AppUIStateProvider } from "src/app/views/partial/ui-state/core";
import { ConfirmationService } from "../confirmation/confirmation.service";
import { setcontrolvalue } from "../utils";
import { FormState, FormStateService } from "../utils/form-state.service";
import { NotificationService } from "../utils/notification.service";
import { CrudService } from "./crud.service";

@Component({
  selector: "app-crud",
  templateUrl: "./crud.component.html",
  styleUrls: ["./crud.component.css"],
  providers: [CrudService],
})
export class CrudComponent
  implements OnInit, AfterViewInit, AfterContentInit, OnDestroy
{
  /**
   *
   */
  @Input() public data$: Observable<any[]> = this.crudService.data$;
  @Input() public data_params?: any;
  @Input() public columns: GridColumnType[] = [];
  @Input() public config: Partial<GridConfigType> = {
    hasActionOverflow: true,
  };
  @Input() public form_id: number = 0;
  @Input() set url(value: string) {
    this.crudService.setURL(value);
  }
  @Input() public title: string = "";
  @Input() public description?: string;
  @Input() public form_title?: string;
  @Input() public grid_title?: string;
  @Input() otherActionOverflowTemplateRef!: TemplateRef<unknown>;
  @Input() otherActionBarTemplateRef!: TemplateRef<unknown>;
  @Input() otherRowDetailTemplateRef!: TemplateRef<unknown>;
  @Input() otherDetailBodyTemplateRef!: TemplateRef<unknown>;
  @Output() public refresh: EventEmitter<any> = new EventEmitter();
  @Output() public otherActionOverflowClick: EventEmitter<any> =
    new EventEmitter();

  public hasTextArea: boolean = true;
  public loading: boolean = true;
  public modal: boolean = false;
  public form: FormState = {
    updating: false,
  };
  private destroy$ = new Subject<void>();

  @ViewChild("formvalue", { static: false })
  formvalue!: ReactiveFormComponentInterface;
  form$ = this.formsClient.get(this.form_id);
  constructor(
    @Inject(FORM_CLIENT) private formsClient: FormsClient,
    private UIState: AppUIStateProvider,
    private formstate: FormStateService,
    private confirmation: ConfirmationService,
    private notification: NotificationService,
    private crudService: CrudService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  ngAfterContentInit(): void {
    this.form$ = this.formsClient
      .get(this.form_id)
      .pipe(takeUntil(this.destroy$));
  }

  ngAfterViewInit(): void {
    this.setLoading();
  }

  async ngOnInit(): Promise<void> {
    this.checkState();
    this.checkModalState();
    this.getData();
  }

  setLoading() {
    this.UIState.uiState.pipe(takeUntil(this.destroy$)).subscribe((state) => {
      this.loading = state.performingAction;
    });
  }

  checkState() {
    this.formstate.currentState
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: FormState) => {
        this.form = state;
      });
  }

  checkModalState() {
    this.modal == false ? this.reset() : "";
  }

  onClose(event: any) {
    if (event === false) {
      this.formvalue?.reset();
    }
  }

  async getData() {
    await lastValueFrom(
      this.crudService.getAll().pipe(takeUntil(this.destroy$))
    );
    // this.UIState.startAction();
    // this.crudService
    //   .getAll(this.data_params)
    //   .pipe(
    //     takeUntil(this.destroy$),
    //     map((res: any) => res?.data),
    //     map((data) => data?.reverse())
    //   )
    //   .subscribe({
    //     next: (data: any) => {
    //       this.data = data;
    //       this.UIState.endAction();
    //     },
    //     error: (err) => this.UIState.endAction(),
    //   });
  }

  onSubmit(event: any) {
    if (this.form.updating) {
      // handling null values in the submited object
      for (const key in event) {
        if (event[key] == null) delete event[key];
      }
      this.crudService
        .update(this.form.item_id, event)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            this.reset();
            this.modal = false;
          },
        });
    } else {
      this.crudService
        .create(event)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.reset();
          },
        });
    }
  }

  onEdit(item: any) {
    this.formstate.editing(item);
    this.formvalue?.formGroup.patchValue(item);
    // for (const key in item) {
    //   key !== "id" ? setcontrolvalue(this.formvalue, key, item[key]) : "";
    //   (key != null || undefined) && key == "publishedAt"
    //     ? setcontrolvalue(
    //         this.formvalue,
    //         key,
    //         formatDate(item[key], "MM/dd/yyyy", "fr")
    //       )
    //     : "";
    // }
    this.modal = true;
  }

  // delete confirmation
  deleteRequest(item: any) {
    this.confirmation.show(item);
  }

  onDelete(item: any) {
    this.crudService
      .delete(item)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.confirmation.close(),
      });
  }

  onRefresh() {
    this.getData();
    this.refresh.emit(true);
  }

  // reset the form
  reset() {
    this.formstate?.resetState();
    this.formvalue?.reset();
  }

  // on other action overflow click
  onOtherActionOverflowClick(item: any) {
    this.otherActionOverflowClick.emit(item);
  }
}
