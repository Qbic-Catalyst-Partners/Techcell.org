import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EMAIL_PATTERN, MOBILE_PATTERN } from '../../../../common/constants';
import { AuthUtils } from '../../../../shared/utility/auth-utils';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrl: './contact-info.component.scss'
})
export class ContactInfoComponent implements OnInit{
  @Input() formValue:any;
  isSubmitted: boolean = false

  constructor(
    private activeModal: NgbActiveModal,
    private _fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    if (!!this.formValue) {
      this.patchValue(this.formValue);
    } else {
      this.prefillFromLocalStorage();
    }

    // Disable read-only fields (mobile, email, state)
    this.contactInfoForm.controls['mobileNumber'].disable();
    this.contactInfoForm.controls['emailId'].disable();
    this.contactInfoForm.controls['state'].disable();
  }

  private prefillFromLocalStorage(): void {
    const userStr = AuthUtils.getUserDetails();
    if (!userStr) {
      return;
    }

    try {
      const userObj = JSON.parse(userStr);
      const userDetail = userObj?.userDetailResponseDTO || {};
      const orgDetail = userObj?.orgDetail || {};

      const patch = {
        mobileNumber: userDetail.mobileNo || '',
        emailId: userDetail.emailId || '',
        linkedIn: userDetail.linkedIn || '',
        state: userDetail.state || orgDetail.state || '',
      } as any;

      this.patchValue(patch);
    } catch (e) {
      console.error('Failed to parse user details from local storage', e);
    }
  }

  public contactInfoForm = this._fb.group({
    mobileNumber: ['', [Validators.required,Validators.pattern(MOBILE_PATTERN)]],
    emailId: ['', [Validators.required,Validators.pattern(EMAIL_PATTERN),]],
    linkedIn: ['', [Validators.required]],
    state: ['', [Validators.required]],
  });

  patchValue(formValue:any){
    this.contactInfoForm.patchValue(formValue);
  }

  get fieldName() {
    return this.contactInfoForm.controls;
  }

  public submitData(): any {
    this.isSubmitted = true;
    if (this.contactInfoForm.valid) {
      const raw = this.contactInfoForm.getRawValue(); // includes disabled
      const payload = {
        mobileNumber: raw.mobileNumber,
        emailId: raw.emailId,
        linkedIn: raw.linkedIn,
        state: raw.state,
      };
      this.activeModal.close(payload);
    }
  }
  close() {
    this.activeModal.close();
  }
}
