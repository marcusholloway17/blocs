import {
  Component,
  Inject,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import {
  FORM_CLIENT,
  FormsClient,
  ReactiveFormComponentInterface,
} from "@azlabsjs/ngx-smart-form";

@Component({
  selector: "app-content-header",
  templateUrl: "./content-header.component.html",
  styleUrls: ["./content-header.component.css"],
})
export class ContentHeaderComponent implements OnInit {
  /**
   * @description title of the content header
   *
   */
  @Input() title: string | undefined;
  /**
   * @description content to display after the title
   */
  @Input() description: string | undefined;
  /**
   * @description display a return button if true
   */
  @Input() hasReturn: boolean = false;

  /**
   * custom template
   */
  @Input() customTemplateRef!: TemplateRef<unknown>;

  @ViewChild("formvalue", { static: false })
  formvalue!: ReactiveFormComponentInterface;
  // form$ = this.formsClient.get();

  constructor(@Inject(FORM_CLIENT) private formsClient: FormsClient) {}

  ngOnInit(): void {}
}
