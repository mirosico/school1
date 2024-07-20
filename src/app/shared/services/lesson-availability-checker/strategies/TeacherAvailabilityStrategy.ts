import { GroupsService } from "../../groups/groups.service";
import { LessonsService } from "../../lessons/lessons.service";
import { AvailabilityCheckStrategy } from "./index";

export class TeacherAvailabilityStrategy implements AvailabilityCheckStrategy {
    constructor(private lessonsService: LessonsService, private groupsService: GroupsService) {}

    checkAvailability(subject: Subject, time: Time) {
        const subjectGroups = this.groupsService
            .findGroups(subject.id);

        const isTeacherAvailable = subjectGroups
            .some((group) => {
                const { teacher } = group;
                const isTeacherBusy = this.lessonsService.lessons
                    .some((lesson) => lesson.teacher.id === teacher.id && lesson.time.day === time.day
            && lesson.time.slot === time.slot);
                const isTeacherBlocked = teacher?.notAvailable
                    ?.some((blockedLessonTime) => blockedLessonTime.day === time.day
            && blockedLessonTime.slot === time.slot);
                return !isTeacherBusy && !isTeacherBlocked;
            });

        if (!isTeacherAvailable) {
            return {
                available: false,
                reason: "Вчитель зайнятий в цей час"
            };
        }
        return { available: true };
    }
}
