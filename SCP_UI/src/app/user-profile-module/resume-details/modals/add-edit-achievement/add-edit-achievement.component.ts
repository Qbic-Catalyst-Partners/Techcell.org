import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-edit-achievement',
  templateUrl: './add-edit-achievement.component.html',
  styleUrl: './add-edit-achievement.component.scss'
})
export class AddEditAchievementComponent implements OnInit{
  @Input() formValue:any;
  isSubmitted: boolean = false;
  public maxCharsText: number = 256;
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
    description: [''],
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
        "description": this.projectForm.controls['description'].value
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

}
