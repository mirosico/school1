import { Directive, HostListener } from "@angular/core";

@Directive({
    selector: "[appTeachersList]",
    standalone: true
})
export class TeachersListDirective {
    private allowedChars = /[a-zA-Zа-яА-ЯґҐєЄіІїЇ.,\s\n\b\r]/;
    private allowedKeyCodes = [8, 46, 13, 188, 17, 91, 224];

    @HostListener("keydown", ["$event"])
    onKeyDown(event: KeyboardEvent) {
        const inputChar = event.key;
        if (this.allowedKeyCodes.includes(event.keyCode)) {
            return;
        }

        if (!this.allowedChars.test(inputChar)) {
            event.preventDefault();
        }
    }
}
