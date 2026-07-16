import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Moment } from 'moment';

@Component({
  selector: 'app-add-edit-experince',
  templateUrl: './add-edit-experince.component.html',
  styleUrl: './add-edit-experince.component.scss'
})
export class AddEditExperinceComponent implements OnInit{
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

  public experienceForm = this._fb.group({
    title: ['', [Validators.required]],
    employmentType: ['', [Validators.required]],
    description: ['', [Validators.required]],
    companyName: ['',[Validators.required]],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
  });

  patchValue(formValue:any){
    this.experienceForm.patchValue(formValue);
  }

  get fieldName() {
    return this.experienceForm.controls;
  }

  public submitData(): any {
    this.isSubmitted = true;
    if (this.experienceForm.valid) {
      let payload = {
        "title": this.experienceForm.controls['title'].value,
        "employmentType": this.experienceForm.controls['employmentType'].value,
        "description": this.experienceForm.controls['description'].value,
        "companyName": this.experienceForm.controls['companyName'].value,
        "startDate":this.experienceForm.controls['startDate'].value,
        "endDate":this.experienceForm.controls['endDate'].value,
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
      this.experienceForm.patchValue({
        startDate:d.toISOString()
      })
    }else{
      let d = new Date(normalizedMonthAndYear.year(), normalizedMonthAndYear.month() + 1, 0);
      this.experienceForm.patchValue({
        endDate:d.toISOString()
      })
    }
    datepicker.close();
  }
}
