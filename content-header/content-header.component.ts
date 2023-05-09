import { Component, Inject, Input, OnInit, ViewChild } from "@angular/core";
import { FORM_CLIENT, FormsClient, ReactiveFormComponentInterface } from "@azlabsjs/ngx-smart-form";

@Component({
  selector: "app-content-header",
  templateUrl: "./content-header.component.html",
  styleUrls: ["./content-header.component.css"],
})
export class ContentHeaderComponent implements OnInit {
  @Input() title: string | undefined;
  @Input() description: string | undefined;
  @Input() hasReturn: boolean = false;


  @ViewChild("formvalue", { static: false })
  formvalue!: ReactiveFormComponentInterface;
  // form$ = this.formsClient.get();

  constructor(@Inject(FORM_CLIENT) private formsClient: FormsClient) {}

  ngOnInit(): void {}
}
