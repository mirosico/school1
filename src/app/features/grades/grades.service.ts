import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GradesService {
  parallels = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'Без паралелі'];
  grades: Grade[] = ['5', '6', '7', '8', '9', '10', '11'];


  constructor() { }
}
