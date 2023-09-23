import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";

@Component({
  selector: "app-profile-picture",
  templateUrl: "./profile-picture.component.html",
  styleUrls: ["./profile-picture.component.css"],
})
export class ProfilePictureComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public DEFAULT_PP_SRC: string = "assets/images/default.png";
  @Input() src?: string = this.DEFAULT_PP_SRC;
  @Input() imgContainerClass?: string;
  @Input() imgClass?: string;

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
