import { Component, OnInit } from '@angular/core';
import {
  EMAIL_PATTERN,
  File_Size_1,
  File_Type_Accepted,
  GENDER_LIST,
  MOBILE_PATTERN,
  PASSWORD_PATTERN,
} from '../../../common/constants';
import { Subject } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../shared/services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../shared/services/common.service';
import {
  confirmPasswordValidator,
  fileSizeValidator,
  fileType,
} from '../../../common/form-validations';
import { DatePipe } from '@angular/common';
import { AuthenticationComponent } from '../../authentication/authentication.component';

@Component({
  selector: 'app-moderator-registration',
  templateUrl: './moderator-registration.component.html',
  styleUrl: './moderator-registration.component.scss',
})
export class ModeratorRegistrationComponent implements OnInit {
  public profilePhotoName: string = '';
  public profilePhoto: any;
  public isSubmitted: boolean = false;
  public genderList: any = GENDER_LIST;
  public config = { format: 'MM-DD-YYYY' };
  public config1 = { format: 'MM-YYYY' };
  public clgNameText = new Subject<string>();
  public clgNameList: any = [];
  public streamList: any = [];
  public securityQuestionList: any = [];
  public programList: any = [];
  email_pattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  public activeTooltip: boolean = false;
  public imageType: string = File_Type_Accepted;
  public activeFacultyProfilePhotoTooltip: boolean = false;
  isPwd: boolean = false;
  isCfPwd: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private apiService: ApiService,
    public modalService: NgbModal,
    public commonService: CommonService
  ) {}
  ngOnInit(): void {
    this.getSecurityQuestionsList();
  }

  public registerForm = this._fb.group(
    {
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(EMAIL_PATTERN),
          Validators.maxLength(50),
        ],
      ],
      mobile: ['', [Validators.required, Validators.pattern(MOBILE_PATTERN)]],
      password: [
        '',
        [Validators.required, Validators.pattern(PASSWORD_PATTERN)],
      ],
      confirmPassword: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      qualification: ['', [Validators.required, Validators.maxLength(50)]],
      domainExpertise: ['', [Validators.required, Validators.maxLength(50)]],
      city: ['', [Validators.maxLength(50)]],
      state: ['', [Validators.maxLength(50)]],
      currentCompany: ['', [Validators.required, Validators.maxLength(50)]],
      currentDesignation: ['', [Validators.maxLength(50)]],
      courseLevel: [''],
      linkedinProfile: ['', Validators.required],
      workExperience: ['', [Validators.required, Validators.maxLength(50)]],
      securityQuestion: ['', Validators.required],
      securityAnswer: ['', [Validators.required, Validators.maxLength(50)]],
      profilePhoto: ['', Validators.required],
      termsConditions: [false, Validators.requiredTrue],
      privacyPolicy: [false, Validators.requiredTrue],
      cookiePolicy: [false, Validators.requiredTrue],
    },
    { validators: [confirmPasswordValidator] }
  );

  // convenience getter for easy access to form fields
  get fieldName() {
    return this.registerForm.controls;
  }

  public async upload(file: any, from: any) {
    const selectedFile = (file && (file.target as HTMLInputElement)).files[0];
    this.registerForm
      .get('profilePhoto')
      ?.setValidators([
        fileType(selectedFile),
        fileSizeValidator(selectedFile, File_Size_1),
      ]);
    this.registerForm.get('profilePhoto')?.updateValueAndValidity();
    this.profilePhotoName = selectedFile.name;

    const bytes = await this.commonService.openImageCropperAndGetBytes(
      selectedFile,
      1,   // square aspect
      true // round cropper
    );

    if (!bytes) {
      return;
    }

    this.profilePhoto = bytes;
  }

  public submitForm(): void {
    this.isSubmitted = true;
    if (this.registerForm.invalid) return;
    // Call the API here
    let payload = {
      courseLevel: '',
      dob: this.registerForm.controls['dob'].value
        ? this.commonService.convertDate(
            this.registerForm.controls['dob'].value
          )
        : null,
      workExp: this.registerForm.controls['workExperience'].value,
      emailId: this.registerForm.controls['email'].value,
      firstName: this.registerForm.controls['firstName'].value,
      lastName: this.registerForm.controls['lastName'].value,
      gender: this.registerForm.controls['gender'].value,
      mobileNo: this.registerForm.controls['mobile'].value,
      password: this.registerForm.controls['password'].value,
      designation: this.registerForm.controls['currentDesignation'].value,
      questionId: this.registerForm.controls['securityQuestion'].value,
      role: 'Moderator',
      securityQuestionAns: this.registerForm.controls['securityAnswer'].value,
      currentCompany: this.registerForm.controls['currentCompany'].value,
      idProof: '',
      profilePhoto: this.profilePhoto ? this.profilePhoto : '',
      qualification: this.registerForm.controls['qualification'].value,
      domailExp: this.registerForm.controls['domainExpertise'].value,
      linkedinProfile: this.registerForm.controls['linkedinProfile'].value,
      city: this.registerForm.controls['city'].value,
      state: this.registerForm.controls['state'].value,
    };

    this.apiService.addUser([payload]).subscribe({
      next: (res: any) => {
        this.profilePhoto = null;
        this.openAuthModal();
        this.registerForm.reset();
      },
      error: (error) => {
        // console.log(error.message);
        this.commonService.dialog('Error', error.message);
      },
    });
  }

  getOrgName(name: string) {
    this.apiService.getListOrgdetailByname(name).subscribe({
      next: (res: any) => {
        this.clgNameList = res.data;
        if (this.clgNameList && this.clgNameList.length) {
          // this.streamList = this.clgNameList[0]?.streams;
          this.getListProgramName(this.clgNameList[0]?.orgId);
          this.registerForm.patchValue({
            domainExpertise: this.clgNameList[0]?.aictecode,
            city: this.clgNameList[0]?.city,
            state: this.clgNameList[0]?.state,
          });
          // this.registerForm.controls['domainExpertise'].disable();
          this.registerForm.controls['city'].disable();
          this.registerForm.controls['state'].disable();
        }
      },
      error: (error) => {
        console.log(error.message);
      },
    });
  }

  getText(event: any) {
    this.clgNameText.next(event.target.value);
  }

  getSecurityQuestionsList() {
    this.apiService.getListSecurityQuestions().subscribe({
      next: (res: any) => {
        this.securityQuestionList = res.data;
      },
      error: (error) => {
        console.log(error.message);
      },
    });
  }

  openAuthModal() {
    const modalRef = this.modalService.open(AuthenticationComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'lg',
      centered: true,
    });
    const data: any = {
      email: this.registerForm.controls.email.value,
      mobile: this.registerForm.controls.mobile.value,
      message: true,
      navigate: true,
    };
    modalRef.componentInstance.viewData = data;
  }

  getListProgramName(id: any) {
    this.apiService.getListProgramName(id).subscribe({
      next: (res: any) => {
        this.programList = res.data;
      },
      error: (error) => {
        console.log(error.message);
      },
    });
  }

  fileToByteArray(file: any) {
    return new Promise((resolve, reject) => {
      try {
        let reader = new FileReader();
        let fileByteArray: any = [];
        reader.readAsArrayBuffer(file);
        reader.onloadend = (evt: any) => {
          if (evt.target.readyState == FileReader.DONE) {
            let arrayBuffer = evt.target.result,
              array = new Uint8Array(arrayBuffer);
            for (let byte of array) {
              fileByteArray.push(byte);
            }
          }
          resolve(fileByteArray);
        };
      } catch (e) {
        reject(e);
      }
    });
  }

  public navigateTo(item: any): void {
    item === 'tnc'
      ? this.commonService.openTermsAndConditionsWindow()
      : this.commonService.openPrivacyPolicyWindow();
  }

  togglePwd() {
    this.isPwd = !this.isPwd;
  }

  toggleCnfPwd() {
    this.isCfPwd = !this.isCfPwd;
  }

  ngOnDestroy(): void {
    this.clgNameText.complete();
  }
}
