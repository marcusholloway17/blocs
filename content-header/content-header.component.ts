import { Component, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-content-header',
  templateUrl: './content-header.component.html',
  styleUrls: ['./content-header.component.css']
})
export class ContentHeaderComponent implements OnInit {
  @Input() title: string | undefined;
  @Input() description: string | undefined;
  @Input() hasReturn: boolean = false;
  @Input() customTemplateRef!: TemplateRef<unknown>;

  constructor() { }

  ngOnInit(): void {
  }

}
