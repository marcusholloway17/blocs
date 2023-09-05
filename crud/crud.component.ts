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
import {
  Observable,
  Subject,
  catchError,
  lastValueFrom,
  takeUntil,
  tap,
  throwError,
} from "rxjs";
import { AppUIStateProvider } from "src/app/views/partial/ui-state/core";
import { ConfirmationService } from "../confirmation/confirmation.service";
import { FormState, FormStateService } from "../utils/form-state.service";
import { NotificationService } from "../utils/notification.service";
import { CrudService } from "./crud.service";
import { ActivatedRoute } from "@angular/router";
import { PermissionService } from "../utils/permission.service";

export type CrudConfingType = {
  title: string;
  description?: string;
  form_title?: string;
  grid_title?: string;
  columns: GridColumnType[];
  config: Partial<GridConfigType>;
  form_id: number;
  url: string;
  data_params?: any;
  allowReturn?: boolean;
};

export type CrudActionType = {
  name: string;
  scopes: string[];
};

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
  @Input() public crudConfig: CrudConfingType = this.route.snapshot
    .data as CrudConfingType;
  @Input() public data_params?: any = this.crudConfig.data_params;
  @Input() public columns: GridColumnType[] = this.crudConfig.columns ?? [];
  @Input() public config: Partial<GridConfigType> = this.crudConfig.config ?? {
    hasActionOverflow: true,
  };
  @Input() public form_id: number = this.crudConfig.form_id ?? 0;
  @Input() set url(value: string) {
    this.crudService.setURL(value);
  }
  @Input() public title: string = this.crudConfig.title ?? "";
  @Input() public description?: string = this.crudConfig.description;
  @Input() public allowReturn?: boolean = this.crudConfig.allowReturn ?? false;
  @Input() public form_title?: string = this.crudConfig.form_title;
  @Input() public grid_title?: string = this.crudConfig.grid_title;
  @Input() public actions?: CrudActionType[] = [
    {
      name: "create",
      scopes: [],
    },
    {
      name: "read",
      scopes: [],
    },
    {
      name: "update",
      scopes: [],
    },
    {
      name: "delete",
      scopes: [],
    },
  ];
  @Input() headerContentTemplateRef!: TemplateRef<unknown>;
  @Input() otherActionOverflowTemplateRef!: TemplateRef<unknown>;
  @Input() otherActionBarTemplateRef!: TemplateRef<unknown>;
  @Input() otherRowDetailTemplateRef!: TemplateRef<unknown>;
  @Input() otherDetailBodyTemplateRef!: TemplateRef<unknown>;
  @Output() public refresh: EventEmitter<any> = new EventEmitter();
  @Output() public detailChange: EventEmitter<any> = new EventEmitter();
  @Output() public readyState: EventEmitter<any> = new EventEmitter();

  public permissions = this.permission$.getPermissions();
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
    private route: ActivatedRoute,
    private UIState: AppUIStateProvider,
    private formstate: FormStateService,
    private confirmation: ConfirmationService,
    private notification: NotificationService,
    private crudService: CrudService,
    private permission$: PermissionService
  ) {
    this.initialize();
  }

  initialize() {
    if (Object.keys(this.crudConfig).length !== 0) {
      // set url
      if (this.crudConfig?.url) {
        this.url = this.crudConfig.url;
      }
    }
  }

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
      this.crudService.getAll(this.data_params).pipe(
        takeUntil(this.destroy$),
        tap((data: any) => this.readyState.emit(data))
      )
    );
  }

  onDetailChange(event: any) {
    this.detailChange.emit(event);
  }

  onReadyState(event: any) {
    // console.log(event);
  }

  onSubmit(event: any) {
    if (this.form.updating) {
      // handling null values in the submited object
      for (const key in event) {
        if (event[key] == null) delete event[key];
      }
      this.crudService
        .update(this.form.item_id, event)
        .pipe(
          takeUntil(this.destroy$),
          catchError((err) => {
            this.notification.error(err);
            return throwError(() => err);
          }),
          tap((res) => {
            this.reset();
            this.modal = false;
          })
        )
        .subscribe();
    } else {
      this.crudService
        .create(event)
        .pipe(
          takeUntil(this.destroy$),
          catchError((err) => {
            this.notification.error(err);
            return throwError(() => err);
          }),
          tap((res) => {
            this.reset();
          })
        )
        .subscribe();
    }
  }

  onEdit(item: any) {
    this.formstate.editing(item);
    // solve radio field error on edit
    if (item?.hasOwnProperty("active")) {
      item.active = item.active.toString();
    }
    this.formvalue?.formGroup.patchValue(item);
    this.modal = true;
  }

  // delete confirmation
  deleteRequest(item: any) {
    this.confirmation.show(item);
  }

  onDelete(item: any) {
    this.crudService
      .delete(item)
      .pipe(
        takeUntil(this.destroy$),
        tap((res) => this.confirmation.close())
      )
      .subscribe();
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

  // actions handler
  hasAction(name: string) {
    return this.actions?.find((e) => e.name === name) ? true : false;
  }

  // scopes handler
  hasScope(action: CrudActionType) {
    const findedAction = this.actions?.find((e) => e.name === action.name);
    if (
      findedAction &&
      action.scopes?.length > 0 &&
      findedAction.scopes?.some((scope) => action?.scopes.includes(scope))
    ) {
      return true;
    } else {
      return false;
    }
  }

  getAction(name: string) {
    return this.actions?.find((e) => e.name === name);
  }

  getScopes(actionName: string) {
    return this.actions?.find((e) => e.name === actionName)?.scopes || [];
  }

  isDisabled(actionName: string) {
    return this.permissions.some((scope) =>
      this.getAction(actionName)?.scopes.includes(scope)
    )
      ? false
      : true;
  }
}
