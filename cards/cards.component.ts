import { Component, Input, OnInit } from '@angular/core';
import { PermissionService } from '../utils/permission.service';

export interface Card {
  title: string;
  subtitle?: string;
  content?: string;
  class?: string;
  actions?: CardAction[];
}

export interface CardAction {
  route: string | string[];
  label: string;
  routeIcon?: string;
  class?: string;
  permission?: string;
}
@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css'],
})
export class CardsComponent implements OnInit {
  public permissions!: string[];
  @Input() public cards: Card[] = [];
  constructor(private permissionService: PermissionService) {
  }

  ngOnInit(): void {
    this.permissions = this.permissionService.getPermissions();
  }
}
