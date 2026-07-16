import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Moment } from 'moment';

@Component({
  selector: 'app-add-edit-project',
  templateUrl: './add-edit-project.component.html',
  styleUrl: './add-edit-project.component.scss'
})
export class AddEditProjectComponent implements OnInit{
  @Input() formValue:any;
  isSubmitted: boolean = false;
  public maxChars: number = 48;
  public maxCharsText: number = 500;
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

  public projectForm = this._fb.group({
    projectTitle: ['', [Validators.required]],
    field: ['', [Validators.required]],
    description: ['', [Validators.required]],
    projectUrl: [''],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
  });

  patchValue(formValue:any){
    this.projectForm.patchValue(formValue);
  }

  get fieldName() {
    return this.projectForm.controls;
  }

  public submitData(): any {
    this.isSubmitted = true;
    if (this.projectForm.valid) {
      let payload = {
        "projectTitle": this.projectForm.controls['projectTitle'].value,
        "field": this.projectForm.controls['field'].value,
        "description": this.projectForm.controls['description'].value,
        "projectUrl": this.projectForm.controls['projectUrl'].value,
        "startDate":this.projectForm.controls['startDate'].value,
        "endDate":this.projectForm.controls['endDate'].value,
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
      this.projectForm.patchValue({
        startDate:d.toISOString()
      })
    }else{
      let d = new Date(normalizedMonthAndYear.year(), normalizedMonthAndYear.month() + 1, 0);
      this.projectForm.patchValue({
        endDate:d.toISOString()
      })
    }
    datepicker.close();
  }
}
