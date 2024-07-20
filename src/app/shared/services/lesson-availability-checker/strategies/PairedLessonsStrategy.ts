import { GroupsService } from "../../groups/groups.service";
import { LessonsService } from "../../lessons/lessons.service";
import { AvailabilityCheckStrategy } from "./index";

export class PairedLessonsStrategy implements AvailabilityCheckStrategy {
    constructor(private lessonsService: LessonsService, private groupsService: GroupsService) {}

    checkAvailability(subject: Subject, time: Time, allowPairedLessons?: boolean) {
        const { grade, key } = subject;
        const lessonsThisDay = this.lessonsService.findLessonsByGradeAndTime(grade, { day: time.day });
        const groupIdsThisDay = lessonsThisDay.map((l) => l.group.id);
        const gradeGroups = this.groupsService.findGradeGroups(grade);
        const groupsThisDay = gradeGroups.filter((g) => groupIdsThisDay.includes(g.id));
        const subjectsThisDay = groupsThisDay.map((g) => g.subject.key);

        if (!allowPairedLessons && subjectsThisDay.includes(key)) {
            return {
                available: false,
                reason: `Предмет ${subject.key} вже є в цей день`
            };
        }
        return { available: true };
    }
}
