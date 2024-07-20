interface Availability {
    available: boolean;
    reason?: string
}
export interface AvailabilityCheckStrategy {
    checkAvailability(subject: Subject, time: Time, allowPairedLessons?: boolean): Availability;
}
