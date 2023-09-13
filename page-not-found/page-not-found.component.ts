import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NavigationService } from "../utils/navigation.service";

@Component({
  selector: "app-page-not-found",
  templateUrl: "./page-not-found.component.html",
  styleUrls: ["./page-not-found.component.css"],
})
export class PageNotFoundComponent implements OnInit {
  constructor(private router: Router, private navigation: NavigationService) {}

  ngOnInit(): void {}

  back(): void {
    this.navigation.back();
  }

  backToDashboard(): void {
    this.router.navigate(["dashboard", "home"]);
  }

  backToLogin(): void {
    this.router.navigate(["login"]);
  }
}
