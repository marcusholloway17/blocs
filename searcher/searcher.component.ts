import {
  AfterContentInit,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { SearcherService } from "./searcher.service";
import {
  FORM_CLIENT,
  FormsClient,
  ReactiveFormComponentInterface,
} from "@azlabsjs/ngx-smart-form";
import {
  Observable,
  Subject,
  catchError,
  takeUntil,
  tap,
  throwError,
} from "rxjs";
import { FormConfigInterface } from "@azlabsjs/smart-form-core";
import { AppUIStateProvider } from "src/app/views/partial/ui-state/core";
import { ClrLoadingState } from "@clr/angular";

export type SearchConfigType = {
  /**
   * Provide a title for the form component
   * @optional title
   */
  title?: string;
  /**
   * show form title section if true
   * @optional showTitle
   */
  showTitle?: boolean;
  /**
   * perform submit request on submit
   * @optional autoSubmit
   */
  autoSubmit?: boolean;
  /**
   * form id used to build the form
   * @required formId number | string
   */
  formId: number | string;
  /**
   * Provide a query if you want to apply a filter
   * @optional query Object
   */
  query?: any;
};

@Component({
  selector: "app-searcher",
  templateUrl: "./searcher.component.html",
  styleUrls: ["./searcher.component.css"],
  providers: [SearcherService],
})
export class SearcherComponent implements OnInit, AfterContentInit, OnDestroy {
  private DEFAULT_CONFIG: SearchConfigType = {
    title: "Search",
    showTitle: false,
    formId: 0,
    autoSubmit: true,
  };

  submitBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;

  /**
   * request url setter
   * @required url string
   */
  @Input() set url(value: string) {
    this.searcherService.setUrl(value);
  }

  /**
   * search config
   * @optional config
   */
  @Input() config: SearchConfigType = this.DEFAULT_CONFIG;

  @ViewChild("formvalue", { static: false })
  formvalue!: ReactiveFormComponentInterface;
  form$!: Observable<FormConfigInterface>;
  private destroy$ = new Subject();

  /**
   * Emit the search form value
   */
  @Output() submit = new EventEmitter();

  /**
   * Emit the result of the search
   */
  @Output() result = new EventEmitter();

  /**
   * Emit true when performing a request and false if not
   */
  @Output() performingRequest = new EventEmitter();

  constructor(
    @Inject(FORM_CLIENT) private formsClient: FormsClient,
    private searcherService: SearcherService,
    private uistate: AppUIStateProvider
  ) {}

  ngOnInit(): void {}

  async ngAfterContentInit(): Promise<void> {
    this.form$ = this.formsClient.get(this.config.formId);
  }

  /**
   * on form ready state
   * @param event form ready state event emitted
   */
  onReadyState(event: any) {}

  /**
   * submit the form data
   * @param event
   */
  onSubmit(event: any) {
    if (this.config.autoSubmit == true) {
      this.startLoader();
      this.searcherService
        .search({ ...event, ...this.config.query })
        .pipe(
          takeUntil(this.destroy$),
          catchError((err) => {
            this.stopLoader();
            return throwError(() => err);
          })
        )
        .subscribe((res: any) => {
          this.result.emit(res);
          this.stopLoader();
        });
    } else {
      this.submit.emit(event);
    }
  }

  /**
   * perform custom search with the form data
   * @param data query params data
   * @param url query params data
   */
  customSearch(data: any = {}, url?: string) {
    this.startLoader();
    this.searcherService
      .customSearch(data, url)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          this.stopLoader();
          return throwError(() => err);
        }),
        tap((response: any) => (this.result.emit(response), this.stopLoader()))
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  /**
   * start loading state
   */
  private startLoader() {
    this.uistate.startAction();
    this.submitBtnState = ClrLoadingState.LOADING;
    this.performingRequest.emit(true);
  }

  /**
   * stop loading state
   */
  private stopLoader() {
    this.uistate.endAction();
    this.submitBtnState = ClrLoadingState.ERROR;
    this.performingRequest.emit(false);
  }
}
