import { Injectable } from "@angular/core";

import { GroupsService } from "../groups/groups.service";
import { LessonsService } from "../lessons/lessons.service";
import { ScheduleMatrixService } from "../schedule/schedule-matrix.service";
import { AvailabilityCheckStrategy } from "./strategies";
import { ForbiddenSubjectsStrategy } from "./strategies/ForbiddenSubjectsStrategy";
import { PairedLessonsStrategy } from "./strategies/PairedLessonsStrategy";
import { SlotOccupancyStrategy } from "./strategies/SlotOccupancyStrategy";
import { TeacherAvailabilityStrategy } from "./strategies/TeacherAvailabilityStrategy";

@Injectable({
    providedIn: "root"
})
export class LessonAvailabilityCheckerService implements AvailabilityCheckStrategy {
    private strategies: AvailabilityCheckStrategy[];

    constructor(
        private scheduleMatrixService: ScheduleMatrixService,
        private lessonsService: LessonsService,
        private groupsService: GroupsService
    ) {
        this.strategies = [
            new SlotOccupancyStrategy(scheduleMatrixService),
            new ForbiddenSubjectsStrategy(lessonsService, groupsService),
            new PairedLessonsStrategy(lessonsService, groupsService),
            new TeacherAvailabilityStrategy(lessonsService, groupsService)
        ];
    }

    checkAvailability(subject: Subject, time: Time, allowPairedLessons?: boolean) {
        for (const strategy of this.strategies) {
            const result = strategy.checkAvailability(subject, time, allowPairedLessons);
            if (!result.available) {
                return result;
            }
        }
        return { available: true };
    }
}
