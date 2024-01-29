import {Injectable} from '@angular/core';
import {Days, Lessons, DaysNames} from "./schedule.config";

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private days =  Days;
  private lessons = Lessons;
  private daysNames = DaysNames;

  getDaysNames() {
    return this.daysNames;
  }

  getDayName(day: Day) {
    return this.daysNames[day];
  }

  getDays() {
    return this.days;
  }

  getLessons() {
    return this.lessons;
  }

  constructor() {
  }
}
