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
} from '@angular/core';
import { SearcherService } from './searcher.service';
import {
  FORM_CLIENT,
  FormsClient,
  ReactiveFormComponentInterface,
} from '@azlabsjs/ngx-smart-form';
import { Observable, Subject, catchError, takeUntil, throwError } from 'rxjs';
import { FormConfigInterface } from '@azlabsjs/smart-form-core';
import { AppUIStateProvider } from 'src/app/views/partial/ui-state/core';

@Component({
  selector: 'app-searcher',
  templateUrl: './searcher.component.html',
  styleUrls: ['./searcher.component.css'],
  providers: [SearcherService],
})
export class SearcherComponent implements OnInit, AfterContentInit, OnDestroy {
  /**
   * request url setter
   * @required url string
   */
  @Input() set url(value: string) {
    this.searcherService.setUrl(value);
  }

  /**
   * form id to make a request
   * @required form_id string | number
   */
  @Input() form_id: number | string = 0;

  /**
   * Provide a query if you want to apply a filter
   * @optional query Object
   */
  @Input() query?: any;

  @ViewChild('formvalue', { static: false })
  formvalue!: ReactiveFormComponentInterface;
  form$!: Observable<FormConfigInterface>;
  private destroy$ = new Subject();

  /**
   * Emit the result of the search
   */
  @Output() onResult = new EventEmitter();

  /**
   * Emit true when performing a request and false if not
   */
  @Output() performingRequest = new EventEmitter();

  constructor(
    @Inject(FORM_CLIENT) private formsClient: FormsClient,
    private searcherService: SearcherService,
    private UIState: AppUIStateProvider
  ) {}

  ngOnInit(): void {}

  async ngAfterContentInit(): Promise<void> {
    this.form$ = this.formsClient.get(this.form_id);
  }

  onSubmit(event: any) {
    this.UIState.startAction();
    this.performingRequest.emit(true);
    this.searcherService
      .search({ ...event, ...this.query })
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          this.UIState.endAction();
          this.performingRequest.emit(false);
          return throwError(() => err);
        })
      )
      .subscribe((res: any) => {
        this.onResult.emit(res);
        this.UIState.endAction();
        this.performingRequest.emit(false);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
