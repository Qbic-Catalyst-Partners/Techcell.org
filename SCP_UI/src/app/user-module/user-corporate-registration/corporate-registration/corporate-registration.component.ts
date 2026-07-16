import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  EMAIL_PATTERN,
  MOBILE_PATTERN,
  PASSWORD_PATTERN,
  File_Size_1,
  File_Type_Accepted,
} from '../../../common/constants';
import {
  confirmPasswordValidator,
  fileSizeValidator,
  fileType,
  noWhitespaceValidator,
} from '../../../common/form-validations';
import { ApiService } from '../../../shared/services/api.service';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../shared/services/common.service';
import { AuthenticationComponent } from '../../authentication/authentication.component';

@Component({
  selector: 'app-corporate-registration',
  templateUrl: './corporate-registration.component.html',
  styleUrls: ['./corporate-registration.component.scss'],
})
export class CorporateRegistrationComponent implements OnInit, OnDestroy {
  public logoName = '';
  public logoBytes: any;
  public isSubmitted = false;
  public imageType = File_Type_Accepted;
  public activeTooltip = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private modalService: NgbModal,
    public commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.getSecurityQuestions();
  }

  securityQuestionList: any[] = [];

  registerForm = this.fb.group(
    {
      companyName: ['Test compnay', [Validators.required, Validators.maxLength(100)]],
      cin: ['1234567890', [Validators.required, Validators.maxLength(21)]],
      gstNumber: ['1234567890', [Validators.required, Validators.maxLength(15)]],
      companyEmail: [
        'manjeshrv321@gmail.com',
        [Validators.required, Validators.pattern(EMAIL_PATTERN)],
      ],
      companyPhone: ['9731400613', [Validators.required, Validators.pattern(MOBILE_PATTERN)]],
      orgAddress: ['Hemandhalli', [Validators.required, Validators.maxLength(255)]],
      state: ['Karnataka', Validators.required],
      city: ['Bengaluru', Validators.required],
      pincode: ['560068', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      website: ['https://www.google.com', Validators.required],
      industryType: ['IT', Validators.required],
      companySize: ['100', Validators.required],
      yearOfIncorporation: ['2025', Validators.required],
      registrationId: ['1234567890', Validators.required],
      mcaRocVerified: [true, Validators.requiredTrue],
      logo: ['', Validators.required],
      securityQuestion: ['', Validators.required],
      securityAnswer: ['Blue', [Validators.required, noWhitespaceValidator()]],
      password: ['02021995Mm$', [Validators.required, Validators.pattern(PASSWORD_PATTERN)]],
      confirmPassword: ['02021995Mm$', Validators.required],
      termsConditions: [true, Validators.requiredTrue],
      privacyPolicy: [true, Validators.requiredTrue],
      cookiePolicy: [true, Validators.requiredTrue],
    },
    { validators: [confirmPasswordValidator] }
  );

  get fieldName() {
    return this.registerForm.controls;
  }

  async uploadLogo(fileInput: any) {
    const selectedFile = (fileInput.target as HTMLInputElement).files![0];
    this.registerForm
      .get('logo')
      ?.setValidators([
        fileType(selectedFile),
        fileSizeValidator(selectedFile, File_Size_1),
      ]);
    this.registerForm.get('logo')?.updateValueAndValidity();
    this.logoName = selectedFile.name;

    const bytes = await this.commonService.openImageCropperAndGetBytes(
      selectedFile,
      1,
      true
    );
    if (!bytes) return;
    this.logoBytes = bytes;
  }

  submitForm() {
    this.isSubmitted = true;
    if (this.registerForm.invalid) return;

    const payload: any = {
      role: 'Corporate',
      // Using company email & phone for user record as well
      emailId: this.registerForm.value.companyEmail,
      mobileNo: this.registerForm.value.companyPhone,
      password: this.registerForm.value.password,
      firstName: this.registerForm.value.companyName,
      lastName: this.registerForm.value.industryType,

      // Corporate specific fields
      orgName: this.registerForm.value.companyName,
      cin: this.registerForm.value.cin,
      gstNumber: this.registerForm.value.gstNumber,
      companyEmail: this.registerForm.value.companyEmail,
      companyPhoneNumber: this.registerForm.value.companyPhone,
      orgAddress: this.registerForm.value.orgAddress,
      pincode: this.registerForm.value.pincode,
      website: this.registerForm.value.website,
      industryType: this.registerForm.value.industryType,
      companySize: this.registerForm.value.companySize,
      yearOfIncorporation: this.registerForm.value.yearOfIncorporation,
      logo: this.logoBytes ? this.logoBytes : '',
      mcaRocVerified: this.registerForm.value.mcaRocVerified,
      registrationId: this.registerForm.value.registrationId,
      questionId: this.registerForm.value.securityQuestion,
      securityQuestionAns: this.registerForm.value.securityAnswer,

      city: this.registerForm.value.city,
      state: this.registerForm.value.state,

      // mandatory placeholders for API schema
      courseLevel: '',
      stream: '',
    };

    this.apiService.addUser([payload]).subscribe({
      next: () => {
        this.openOtpModal();
        this.registerForm.reset();
        this.logoBytes = null;
      },
      error: (err) => {
        this.commonService.dialog('Error', err.message);
      },
    });
  }

  openOtpModal() {
    const modalRef = this.modalService.open(AuthenticationComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      centered: true,
    });
    const data: any = {
      email: this.registerForm.controls.companyEmail.value,
      mobile: this.registerForm.controls.companyPhone.value,
      message: true,
      navigate: true,
    };
    modalRef.componentInstance.viewData = data;
  }

  getSecurityQuestions() {
    this.apiService.getListSecurityQuestions().subscribe({
      next: (res: any) => (this.securityQuestionList = res.data),
      error: () => (this.securityQuestionList = []),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
} 