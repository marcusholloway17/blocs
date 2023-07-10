import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CalendarOptions, EventInput } from "@fullcalendar/core";
import { Observable } from "rxjs";

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.css"],
})
export class CalendarComponent implements OnInit {
  @Input() options!: CalendarOptions;
  @Input() events!: Observable<EventInput>;
  @Output() dateClick: EventEmitter<any> = new EventEmitter();
  @Output() eventClick: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  onDateClick(event: any) {
    this.dateClick.emit(event);
  }
  onEventClick(event: any) {
    this.eventClick.emit(event);
  }
}
