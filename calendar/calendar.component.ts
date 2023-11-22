import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FullCalendarComponent } from "@fullcalendar/angular";
import { CalendarOptions, DateSelectArg, EventInput } from "@fullcalendar/core";
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
  @Output() select: EventEmitter<any> = new EventEmitter();
  @ViewChild("calendar") calendarComponent!: FullCalendarComponent;

  constructor() {}

  ngOnInit(): void {}

  onDateClick(event: any) {
    this.dateClick.emit(event);
  }
  onEventClick(event: any) {
    this.eventClick.emit(event);
  }
  onDateSelect(event: DateSelectArg) {
    this.select.emit({ start: event.start, end: event.end });
  }
}
