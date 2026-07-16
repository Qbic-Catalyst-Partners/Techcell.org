import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../shared/services/api.service';
import { CommonService } from '../../shared/services/common.service';

import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss',
})
export class ForgetPasswordComponent implements OnInit {
  public isSubmitted: boolean = false;

  @Input() viewData!: any;
  constructor(
    private _fb: FormBuilder,
    private apiService: ApiService,
    private commonService: CommonService,
    private matDialogRef: MatDialogRef<ForgetPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
    if (dialogData) {
      this.viewData = dialogData;
    }
  }

  ngOnInit(): void {
    if (this.viewData?.email) {
      this.loginForm.patchValue({ emailId: this.viewData.email });
      this.loginForm.controls['emailId'].disable();

      if (this.viewData?.questiondesc) {
        this.loginForm.patchValue({ question: this.viewData.questiondesc });
        this.loginForm.controls['question'].disable();
      } else {
        this.fetchSecurityQuestion(this.viewData.email);
      }
    }
  }

  public loginForm = this._fb.group({
    emailId: ['', Validators.required],
    question: [''],
    answer: ['', Validators.required],
  });

  submitForm() {
    this.isSubmitted = true;
    let payload = {
      ans: this.loginForm.controls.answer.value,
      emailId: this.loginForm.controls.emailId.value,
    };
    if (this.loginForm.valid) {
      this.apiService.verifySecurityQuestion(payload).subscribe({
        next: (res: any) => {
          // Security question verified – close dialog and inform parent
          this.matDialogRef.close(true);
        },
        error: (error) => {
          // Close the dialog to ensure error modal appears on top, then show error
          this.matDialogRef.close(false);
          setTimeout(() => {
            this.commonService.dialog(
              'newErrorModal',
              error.message,
              '',
              'OK',
              'Error'
            );
          });
        },
      });
    }
  }

  get fieldName() {
    return this.loginForm.controls;
  }

  patchValue(formValue: any) {
    this.loginForm.patchValue({
      emailId: formValue.email,
      question: formValue?.questiondesc,
    });
    this.loginForm.controls['emailId'].disable();
    this.loginForm.controls['question'].disable();
  }

  close() {
    this.matDialogRef.close();
  }

  private fetchSecurityQuestion(email: string): void {
    this.apiService.getSecurityQuestionsByEmail(email).subscribe({
      next: (res: any) => {
        const question = res?.data?.questiondesc || res?.data?.question || '';
        this.loginForm.patchValue({ question });
        this.loginForm.controls['question'].disable();
      },
      error: (error) => {
        this.commonService.dialog(
          'newErrorModal',
          error.message ?? 'Unable to fetch security question',
          '',
          'OK',
          'Error'
        );
      },
    });
  }
}
