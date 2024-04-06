import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class ParallelsService {
    readonly #parallels: Parallel[] = ["А", "Б", "В", "Г", "Д", "Е", "Ж"];

    get parallels() {
        return this.#parallels;
    }

    hasParallel(parallel: Parallel) {
        return parallel !== this.#parallels[0];
    }
}
