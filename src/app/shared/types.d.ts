declare type GradeNumber = "5" | "6" | "7" | "8" | "9" | "10" | "11";
declare type Parallel = "А" | "Б" | "В" | "Г" | "Д" | "Е" | "Ж";
declare type Grade = `${GradeNumber}${Parallel}` | `${GradeNumber}`;
type Slot = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
type Day = 0 | 1 | 2 | 3 | 4;

interface Time {
    day: Day;
    slot: Slot;
}
declare interface Teacher {
    id: string;
    name: string;
    subjectKeys?: Subject["key"][];
    notAvailable?: Time[];
}
declare interface Lesson {
    id: string;
    time: Time;
    group: Pick<SubjectGroup, "id">;
    teacher: Teacher;
}
declare interface SubjectGroup {
    id: string;
    group: number;
    subject: Subject;
    teacher: Teacher;
}
declare interface Subject {
    id: string;
    key: string;
    label: string;
    difficulty: number;
    grade: Grade;
    hours: number;
    groupNumber: number;
    forbiddenSameDaySubjectKeys?: Subject["key"][];
}
declare interface User {
    login: string;
    password: string;
}
