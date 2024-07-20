import { ScheduleMatrixService } from "../../schedule/schedule-matrix.service";
import { AvailabilityCheckStrategy } from "./index";

export class SlotOccupancyStrategy implements AvailabilityCheckStrategy {
    constructor(private scheduleMatrixService: ScheduleMatrixService) {}

    checkAvailability(subject: Subject, time: Time) {
        if (this.scheduleMatrixService.isSlotOccupied(time.day, time.slot)) {
            return { available: false, reason: "Цей слот вже зайнятий" };
        }
        return { available: true };
    }
}
