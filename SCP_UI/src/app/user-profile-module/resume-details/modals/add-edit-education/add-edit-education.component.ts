import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MyFormat } from '../../../../shared/utility/dateFormate';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-add-edit-education',
  templateUrl: './add-edit-education.component.html',
  styleUrl: './add-edit-education.component.scss',
  providers: [
    { provide: MAT_DATE_FORMATS, useClass: MyFormat }
  ]
})
export class AddEditEducationComponent implements OnInit{
  @Input() formValue:any;
  isSubmitted: boolean = false;
  public maxChars: number = 48;

  constructor(
    private activeModal: NgbActiveModal,
    private _fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    if(!!this.formValue){
      console.log(this.formValue)
      this.patchValue(this.formValue)
    }
  }

  public educationForm = this._fb.group({
    schoolName: ['', [Validators.required]],
    degree: ['', [Validators.required]],
    fieldOfStudy: ['', [Validators.required]],
    grade: ['', [Validators.required]],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
  });

  patchValue(formValue:any){
    this.educationForm.patchValue(formValue);
  }

  get fieldName() {
    return this.educationForm.controls;
  }

  public submitData(): any {
    this.isSubmitted = true;
    if (this.educationForm.valid) {
      let payload = {
        "schoolName": this.educationForm.controls['schoolName'].value,
        "degree": this.educationForm.controls['degree'].value,
        "fieldOfStudy": this.educationForm.controls['fieldOfStudy'].value,
        "grade": this.educationForm.controls['grade'].value,
        "startDate":this.educationForm.controls['startDate'].value,
        "endDate":this.educationForm.controls['endDate'].value,
      }
      if(this.formValue?.id){
        this.activeModal.close({...payload,id:this.formValue?.id});
      }else{
        this.activeModal.close(payload);
      }
    }
  }
  close() {
    this.activeModal.close();
  }

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>,type:string) {
    if(type == 'start'){
      let d = new Date(normalizedMonthAndYear.year(), normalizedMonthAndYear.month() + 1, 0);
      this.educationForm.patchValue({
        startDate:d.toISOString()
      })
    }else{
      let d = new Date(normalizedMonthAndYear.year(), normalizedMonthAndYear.month() + 1, 0);
      this.educationForm.patchValue({
        endDate:d.toISOString()
      })
    }
    datepicker.close();
  }
}
