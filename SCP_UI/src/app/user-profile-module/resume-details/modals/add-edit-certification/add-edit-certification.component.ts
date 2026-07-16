import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Moment } from 'moment';

@Component({
  selector: 'app-add-edit-certification',
  templateUrl: './add-edit-certification.component.html',
  styleUrl: './add-edit-certification.component.scss'
})
export class AddEditCertificationComponent implements OnInit{
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

  public CertificationForm = this._fb.group({
    certifyingEntity: ['', [Validators.required]],
    field: ['', [Validators.required]],
    description: ['', [Validators.required]],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
  });

  patchValue(formValue:any){
    this.CertificationForm.patchValue(formValue);
  }

  get fieldName() {
    return this.CertificationForm.controls;
  }

  public submitData(): any {
    this.isSubmitted = true;
    if (this.CertificationForm.valid) {
      let payload = {
        "certifyingEntity": this.CertificationForm.controls['certifyingEntity'].value,
        "field": this.CertificationForm.controls['field'].value,
        "description": this.CertificationForm.controls['description'].value,
        "startDate":this.CertificationForm.controls['startDate'].value,
        "endDate":this.CertificationForm.controls['endDate'].value,
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
      this.CertificationForm.patchValue({
        startDate:d.toISOString()
      })
    }else{
      let d = new Date(normalizedMonthAndYear.year(), normalizedMonthAndYear.month() + 1, 0);
      this.CertificationForm.patchValue({
        endDate:d.toISOString()
      })
    }
    datepicker.close();
  }
}
