import { NgForOf } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatGridListModule } from "@angular/material/grid-list";
import { BehaviorSubject, Subscription } from "rxjs";

import { SubjectsService } from "../../../../shared/services/subjects/subjects.service";

interface TableRow extends Omit<Subject, "id" | "grade"> {
    groupNumber: number;
    hours: number;
    checked: boolean;
    id?: string;
}

@Component({
    selector: "app-grade-subjects",
    standalone: true,
    imports: [
        MatGridListModule,
        MatCheckboxModule,
        FormsModule,
        NgForOf,
        MatButtonModule
    ],
    templateUrl: "./grade-subjects.component.html",
    styleUrl: "./grade-subjects.component.scss"
})
export class GradeSubjectsComponent {
    tableData = new BehaviorSubject<TableRow[]>([] as TableRow[]);
    @Input({ required: true })
        gradeKey!: BehaviorSubject<Grade | null>;
    private gradeKeySubscription!: Subscription;

    constructor(private subjectsService: SubjectsService) {
    }

    initTableData(gradeKey: Grade | null) {
        if (!gradeKey) {
            return;
        }
        const gradeSubjects = this.subjectsService.getSubjects({
            grade: gradeKey
        });
        const hasSavedSubjects = gradeSubjects.length > 0;
        this.tableData.next(this.subjectsService.subjectsConfig.map(
            ({ possibleGrades, ...subjectConfig }) => {
                const savedSubject = this.subjectsService.getSubjectByKeyAndGrade(subjectConfig.key, gradeKey);
                const gradeNumber = parseInt(gradeKey, 10).toString();
                return ({
                    ...subjectConfig,
                    groupNumber: savedSubject?.groupNumber ?? subjectConfig.groupNumber,
                    hours: savedSubject?.hours ?? subjectConfig.hours,
                    checked: !!savedSubject || (!hasSavedSubjects && possibleGrades.includes(gradeNumber as Grade)),
                    id: savedSubject?.id
                });
            }
        ));
    }
    ngOnInit() {
        this.gradeKeySubscription = this.gradeKey.subscribe(
            this.initTableData.bind(this)
        );
    }

    save() {
        if (this.tableData.value.length === 0 || this.gradeKey.value === null) {
            return;
        }
        const subjectsToUpdate: Subject[] = [];
        const subjectsToCreate: Omit<Subject, "id">[] = [];
        const subjectsToDelete: Subject[] = [];
        this.tableData.value.forEach(({ checked, ...subjectRest }) => {
            const subject = {
                ...subjectRest,
                grade: this.gradeKey.value
            } as Omit<Subject, "id"> & { id?: string };
            if (checked) {
                if (subject.id) {
                    subjectsToUpdate.push(subject as Subject);
                } else {
                    subjectsToCreate.push(subject);
                }
            } else if (subject.id) {
                subjectsToDelete.push(subject as Subject);
            }
        });
        this.subjectsService.createSubjects(subjectsToCreate);
        this.subjectsService.updateSubjects(subjectsToUpdate);
        this.subjectsService.deleteSubjects(subjectsToDelete);
    }

    ngOnDestroy() {
        this.gradeKeySubscription.unsubscribe();
    }

    onInputChange(
        key: keyof Pick<TableRow, "checked" | "hours" | "groupNumber">,
        value: number | boolean,
        rowId: TableRow["key"]
    ) {
        const tableData = this.tableData.value.map(
            (subject) => {
                if (subject.key === rowId) {
                    return ({
                        ...subject,
                        [key]: value
                    });
                }
                return subject;
            }
        );
        this.tableData.next(tableData);
    }
}
