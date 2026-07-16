import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../shared/services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PASSWORD_PATTERN } from '../../common/constants';
import { confirmPasswordValidator } from '../../common/form-validations';
import { CommonService } from '../../shared/services/common.service';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  isNewPwd: boolean = false;
  isCnfPwd: boolean = false;
  isSubmitted: boolean = false;

  @Input() viewData!: any;
  constructor(
    private _fb: FormBuilder,
    private apiService: ApiService,
    public commonService: CommonService,
    private matDialogRef: MatDialogRef<ResetPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {}
  public resetForm = this._fb.group(
    {
      password: [
        '',
        [Validators.required, Validators.pattern(PASSWORD_PATTERN)],
      ],
      confirmPassword: ['', Validators.required],
    },
    { validators: [confirmPasswordValidator] }
  );

  get fieldName() {
    return this.resetForm['controls'];
  }

  submitForm() {
    this.isSubmitted = true;
    let payload = {
      emailId: this.viewData.email,
      password: this.resetForm.controls['password'].value,
    };
    if (this.resetForm.valid) {
      this.apiService.resetPassword(payload).subscribe({
        next: (res: any) => {
          console.log(res);
          this.matDialogRef.close();
          this.commonService.dialog(
            'newSuccessModal',
            'Your password has been successfully updated.',
            '',
            'Login',
            'Success'
          );
        },
        error: (error) => {
          console.log(error.message);
          this.commonService.dialog('newErrorModal', error.message, '', 'OK', 'Error');
        },
      });
    }
  }

  newPwd() {
    this.isNewPwd = !this.isNewPwd;
  }

  cnfPwd() {
    this.isCnfPwd = !this.isCnfPwd;
  }

  close() {
    this.matDialogRef.close();
  }
}
