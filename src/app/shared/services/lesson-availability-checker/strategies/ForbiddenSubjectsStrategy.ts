import { GroupsService } from "../../groups/groups.service";
import { LessonsService } from "../../lessons/lessons.service";
import { AvailabilityCheckStrategy } from "./index";

export class ForbiddenSubjectsStrategy implements AvailabilityCheckStrategy {
    constructor(private lessonsService: LessonsService, private groupsService: GroupsService) {}

    checkAvailability(subject: Subject, time: Time) {
        const { grade, forbiddenSameDaySubjectKeys } = subject;
        const lessonsThisDay = this.lessonsService
            .findLessonsByGradeAndTime(grade, { day: time.day });
        const groupIdsThisDay = lessonsThisDay.map((l) => l.group.id);
        const gradeGroups = this.groupsService
            .findGradeGroups(grade);
        const groupsThisDay = gradeGroups
            .filter((g) => groupIdsThisDay.includes(g.id));
        const subjectsThisDay = groupsThisDay
            .map((g) => g.subject.key);

        if (forbiddenSameDaySubjectKeys && forbiddenSameDaySubjectKeys.find((disabled) => subjectsThisDay
            .includes(disabled))) {
            return {
                available: false,
                reason: `Предмет ${subject.key} не може бути в один день з ${forbiddenSameDaySubjectKeys.join(", ")}`
            };
        }
        return { available: true };
    }
}
