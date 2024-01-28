
declare type DefaultGrade = '5' | '6' | '7' | '8' | '9' | '10' | '11';

declare type Parallel = 'А'| 'Б'| 'В'| 'Г'| 'Д'| 'Е'| 'Ж' | 'Без паралелі';

declare type Grade = `${DefaultGrade}${Parallel}` | `${DefaultGrade}`;

declare interface Subject {
  id: string;
  label: string;
  groupNumber?: number;
  hours?: number;
  teachers?: Teacher[];
}

declare type GradesFormControls = {
  [key in Grade]: FormControl<Parallel | null>;
};


declare interface Teacher {
  id: string;
  name: string;
  subjectIds?: Subject['id'][];
  blockedTime?: LessonTime[],
}

declare type Day = 0 |1 | 2 | 3 | 4;

declare type Lesson = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

declare interface LessonTime {
  day: Day;
  time: Lesson;
}
