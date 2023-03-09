import { formatDate } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { GridColumnType, GridConfigType } from '@azlabsjs/ngx-clr-smart-grid';
import {
  FormComponentInterface,
  FormsClient,
  FORM_CLIENT,
} from '@azlabsjs/ngx-smart-form';
import { tap } from 'rxjs';
import { AppUIStateProvider } from 'src/app/views/partial/ui-state/core';
import { ConfirmationService } from '../confirmation/confirmation.service';
import { setcontrolvalue } from '../utils';
import { FormState, FormStateService } from '../utils/form-state.service';
import { NotificationService } from '../utils/notification.service';
import { CrudService } from './crud.service';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css'],
  providers: [CrudService],
})
export class CrudComponent implements OnInit, AfterViewInit, AfterContentInit {
  /**
   *
   */
  @Input() public data: any[] = [];
  @Input() public data_params?: any;
  @Input() public columns: GridColumnType[] = [];
  @Input() public config: Partial<GridConfigType> = {
    hasActionOverflow: true,
  };
  @Input() public form_id: number = 0;
  @Input() set url(value: string) {
    this.crudService.setURL(value);
  }
  @Input() public title: string = '';
  @Input() public description?: string;
  @Input() public form_title?: string;
  @Input() public grid_title?: string;
  @Output() public refresh: EventEmitter<any> = new EventEmitter();

  public hasTextArea: boolean = true;
  public loading: boolean = true;
  public modal: boolean = false;
  public form: FormState = {
    updating: false,
  };

  @ViewChild('formvalue', { static: false }) formvalue!: FormComponentInterface;
  form$ = this.formsClient.get(this.form_id);
  constructor(
    @Inject(FORM_CLIENT) private formsClient: FormsClient,
    private UIState: AppUIStateProvider,
    private formstate: FormStateService,
    private confirmation: ConfirmationService,
    private notification: NotificationService,
    private crudService: CrudService
  ) {}

  ngAfterContentInit(): void {
    this.form$ = this.formsClient.get(this.form_id);
  }

  ngAfterViewInit(): void {
    this.setLoading();
  }

  ngOnInit(): void {
    this.checkState();
    this.checkModalState();
    this.getData();
  }

  setLoading() {
    this.UIState.uiState.subscribe((state) => {
      this.loading = state.performingAction;
    });
  }

  checkState() {
    this.formstate.currentState.subscribe((state: FormState) => {
      this.form = state;
    });
  }

  checkModalState() {
    this.modal == false ? this.reset() : '';
  }

  getData() {
    this.UIState.startAction();
    this.crudService.getAll(this.data_params).subscribe(
      (res: any) => {
        this.data = res?.data?.reverse();
        this.UIState.endAction();
      },
      (error: any) => {
        this.UIState.endAction();
      }
    );
  }

  onAdd() {
    this.reset();
    this.modal = true;
  }

  onSubmit(event: any) {
    this.UIState.startAction();
    if (this.form.updating) {
      // handling null values in the submited object
      for (const key in event) {
        if (event[key] == null) delete event[key];
      }
      this.crudService.update(this.form.item_id, event).subscribe(
        (res: any) => {
          this.getData();
          this.reset();
          this.notification.success();
        },
        (error: any) => {
          this.notification.error(error);
        }
      );
    } else {
      this.crudService.create(event).subscribe(
        (res: any) => {
          this.getData();
          this.reset();
          this.notification.success();
        },
        (error: any) => {
          this.notification.error(error?.error?.message);
        }
      );
    }
  }

  onEdit(item: any) {
    this.formstate.editing(item);
    for (const key in item) {
      key !== 'id' ? setcontrolvalue(this.formvalue, key, item[key]) : '';
      (key != null || undefined) && key == 'publishedAt'
        ? setcontrolvalue(
            this.formvalue,
            key,
            formatDate(item[key], 'MM/dd/yyyy', 'fr')
          )
        : '';
    }
    this.modal = true;
  }

  // delete confirmation
  deleteRequest(item: any) {
    this.confirmation.show(item);
  }

  onDelete(item: any) {
    this.UIState.startAction();
    this.crudService.delete(item?.id).subscribe(
      (res: any) => {
        this.onRefresh();
        this.notification.success();
      },
      (error: any) => {
        this.notification.error(error);
      }
    );
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
}
