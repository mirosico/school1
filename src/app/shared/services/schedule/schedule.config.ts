const Days: Day[] = [
    0,
    1,
    2,
    3,
    4,
];

const DaysNames = [
    "Понеділок",
    "Вівторок",
    "Середа",
    "Четвер",
    "П'ятниця",
] as const;

const Slots: Slot[] = [0, 1, 2, 3, 4, 5, 6, 7];

const SlotsByPriority: Slot[] = [2, 3, 4, 1, 5, 6, 7];

const ExtraSlots: Slot[] = [0];

const DaysByPriority: Day[] = [1, 2, 3, 0, 4];

export {
    Days,
    DaysByPriority,
    DaysNames,
    ExtraSlots,
    Slots,
    SlotsByPriority,
};
