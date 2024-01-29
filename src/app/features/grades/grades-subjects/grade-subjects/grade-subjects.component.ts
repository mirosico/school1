import {Component, Input} from '@angular/core';
import {SubjectsService} from "../../../../shared/subjects.service";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {FormsModule} from "@angular/forms";
import {BehaviorSubject, Subscription} from "rxjs";

interface TableRow extends Subject {
  groupNumber: number;
  hours: number;
  checked: boolean;
}

@Component({
  selector: 'app-grade-subjects',
  standalone: true,
  imports: [
    MatGridListModule,
    MatCheckboxModule,
    FormsModule
  ],
  templateUrl: './grade-subjects.component.html',
  styleUrl: './grade-subjects.component.scss'
})
export class GradeSubjectsComponent {
  tableData = new BehaviorSubject<TableRow[]>([] as TableRow[])
  private tableDataSubscription!: Subscription;
  private gradeKeySubscription!: Subscription;

  @Input({ required: true })
  gradeKey!: BehaviorSubject<Grade | null>


  constructor(private subjectsService: SubjectsService) {
  }

  initTableData(gradeKey: Grade | null) {
    if (!gradeKey) {
      return;
    }
    const savedSubjects = this.subjectsService.getSubjects(gradeKey);
    this.tableData.next(this.subjectsService.getAllSubjects().map(
      subject => {
        const savedSubject = savedSubjects.find(s => s.id === subject.id);
        return ({
          ...subject,
          groupNumber: savedSubject?.groupNumber ?? 1,
          hours: savedSubject?.hours ?? 1,
          checked: !!savedSubject
        })
      }));
  }
  ngOnInit() {
    this.gradeKeySubscription = this.gradeKey.subscribe(
      this.initTableData.bind(this)
    );
    this.tableDataSubscription =this.tableData.subscribe(
      data => {
        if (data.length === 0 || !this.gradeKey.value) {
          return;
        }
        const subjects = data.filter(subject => subject.checked).map(({checked, ...subject}) => subject);
        this.subjectsService.saveSubjects(this.gradeKey.value, subjects);
      }
    );
  }

  ngOnDestroy() {
    this.tableDataSubscription.unsubscribe();
    this.gradeKeySubscription.unsubscribe();
  }

  onInputChange(key: keyof Pick<TableRow, 'checked' | 'hours' | 'groupNumber'>, value: number | boolean, rowId: TableRow['id']) {
    const tableData = this.tableData.value.map(
      subject => {
        if (subject.id === rowId) {
          return ({
            ...subject,
            [key]: value
          })
        }
        return subject;
      }
    )
    this.tableData.next(tableData);
  }

}
