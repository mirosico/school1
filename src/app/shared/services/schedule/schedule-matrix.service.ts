import { Injectable } from "@angular/core";

import {
    Days, DaysByPriority, DaysNames, ExtraSlots, Slots, SlotsByPriority
} from "./schedule.config";

@Injectable({
    providedIn: "root"
})
export class ScheduleMatrixService {
    #slots = Slots;
    #days = Days;
    #dayNames = DaysNames;
    #slotsByPriority = SlotsByPriority;
    #extraSlots = ExtraSlots;
    #daysByPriority = DaysByPriority;
    #matrix: boolean[][] = this.getInitializedMatrix();

    get slotsByPriority() {
        return this.#slotsByPriority;
    }

    get extraSlots() {
        return this.#extraSlots;
    }

    get daysByPriority() {
        return this.#daysByPriority;
    }

    get slots(): Slot[] {
        return [...this.#slots];
    }

    get days(): Day[] {
        return [...this.#days];
    }

    get matrix(): boolean[][] {
        return this.#matrix;
    }

    get dayNames() {
        return this.#dayNames;
    }

    getDayName(day: Day) {
        return this.#dayNames[day];
    }

    clearMatrix() {
        this.#matrix = this.getInitializedMatrix();
    }

    markSlotAsOccupied(day: number, slot: number): void {
        this.#matrix[day][slot] = true;
    }

    isSlotOccupied(day: number, slot: number): boolean {
        return this.#matrix[day][slot];
    }

    slotsByDay(day: Day): boolean[] {
        return this.#matrix[day];
    }

    private getInitializedMatrix() {
        return new Array(this.#days.length)
            .fill(false)
            .map(() => new Array(this.#slots.length).fill(false));
    }
}
