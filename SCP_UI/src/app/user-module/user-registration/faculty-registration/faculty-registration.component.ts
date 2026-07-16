import { Component, OnInit } from '@angular/core';
import {
  EMAIL_PATTERN,
  File_Size_1,
  File_Type_Accepted,
  GENDER_LIST,
  MOBILE_PATTERN,
  PASSWORD_PATTERN,
} from '../../../common/constants';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map, catchError } from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../shared/services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../shared/services/common.service';
import {
  confirmPasswordValidator,
  fileSizeValidator,
  fileType,
  noWhitespaceValidator,
} from '../../../common/form-validations';
import { DatePipe } from '@angular/common';
import { AuthenticationComponent } from '../../authentication/authentication.component';

@Component({
  selector: 'app-faculty-registration',
  templateUrl: './faculty-registration.component.html',
  styleUrl: './faculty-registration.component.scss',
})
export class FacultyRegistrationComponent implements OnInit {
  public profilePhotoName: string = '';
  public profilePhoto: any;
  public isSubmitted: boolean = false;
  public genderList: any = GENDER_LIST;
  public config = { format: 'MM-DD-YYYY' };
  public config1 = { format: 'MM-YYYY' };
  // Typeahead related
  public clgNameList: any = [];
  public streamList: any = [];
  public securityQuestionList: any = [];
  public programList: any = [];
  public email_pattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  public activeTooltip: boolean = false;
  public activeFacultyProfilePhotoTooltip: boolean = false;
  public imageType: string = File_Type_Accepted;
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
      firstName: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          noWhitespaceValidator(),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          noWhitespaceValidator(),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(EMAIL_PATTERN),
          Validators.maxLength(50),
        ],
      ],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: [
        '',
        [Validators.required, Validators.pattern(PASSWORD_PATTERN)],
      ],
      confirmPassword: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      institute: ['', [Validators.required, Validators.maxLength(50)]],
      AICTECode: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      facultyID: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          noWhitespaceValidator(),
        ],
      ],
      designation: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          noWhitespaceValidator(),
        ],
      ],

      securityQuestion: ['', Validators.required],
      securityAnswer: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          noWhitespaceValidator(),
        ],
      ],
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
      1,
      true
    );

    if (!bytes) {
      return;
    }

    this.profilePhoto = bytes;
  }

  public submitForm(): void {
    let grdDate: any;
    let effDate: any;

    this.isSubmitted = true;
    if (this.registerForm.invalid) return;
    // Call the API here
    let payload = {
      dob: this.registerForm.controls['dob'].value
        ? this.commonService.convertDate(
            this.registerForm.controls['dob'].value
          )
        : null,
      effectiveDate: effDate,
      emailId: this.registerForm.controls['email'].value,
      firstName: this.registerForm.controls['firstName'].value,
      lastName: this.registerForm.controls['lastName'].value,
      gender: this.registerForm.controls['gender'].value,
      graduationCompletiondate: grdDate,
      mobileNo: this.registerForm.controls['mobile'].value,
      orgId: this.clgNameList[0]?.orgId,
      password: this.registerForm.controls['password'].value,
      designation: this.registerForm.controls['designation'].value,
      questionId: this.registerForm.controls['securityQuestion'].value,
      role: 'Faculty',
      securityQuestionAns: this.registerForm.controls['securityAnswer'].value,
      facultyId: this.registerForm.controls['facultyID'].value,
      idProof: '',
      profilePhoto: this.profilePhoto ? this.profilePhoto : '',
      courseLevel: '',
      programName: '',
      stream: '',
      city: this.registerForm.controls['city'].value,
      state: this.registerForm.controls['state'].value,
    };

    this.apiService.addUser([payload]).subscribe({
      next: (res: any) => {
        console.log(res);

        this.profilePhoto = null;
        this.openAuthModal();
        this.registerForm.reset();
      },
      error: (error) => {
        console.log(error.message);
        this.commonService.dialog('Error', error.message);
      },
    });
  }

  // Typeahead search function
  searchInstitute = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) => {
        if (!term || term.length < 1) {
          return of([]);
        }
        return this.apiService.getListOrgdetailByname(term).pipe(
          map((res: any) => {
            this.clgNameList = res.data;
            return res.data;
          }),
          catchError(() => of([]))
        );
      })
    );
  };

  resultFormatInstitute = (x: any) => x.orgName;
  inputFormatInstitute = (x: any) => x.orgName;

  onInstituteSelected(event: any) {
    const selectedOrg = event.item;
    if (!selectedOrg) return;

    this.clgNameList = [selectedOrg];

    this.registerForm.patchValue({
      AICTECode: selectedOrg.aictecode,
      city: selectedOrg.city,
      state: selectedOrg.state,
    });

    this.registerForm.controls['AICTECode'].disable();
    this.registerForm.controls['city'].disable();
    this.registerForm.controls['state'].disable();
  }

  // getText removed – not needed with typeahead

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

  onMobileKeyPress(event: KeyboardEvent): boolean {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
      return false;
    }

    const input = event.target as HTMLInputElement;
    if (input.value.length >= 10) {
      event.preventDefault();
      return false;
    }

    return true;
  }

  onMobileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '').substring(0, 10);
    this.registerForm.get('mobile')?.setValue(input.value);

    // Mark as touched to trigger validation
    this.registerForm.get('mobile')?.markAsTouched();

    // Update validation
    if (input.value.length < 10) {
      this.registerForm.get('mobile')?.setErrors({ pattern: true });
    }
  }

  get isMobileLengthValid(): boolean {
    const mobileControl = this.registerForm.get('mobile');
    if (mobileControl && mobileControl.value) {
      return mobileControl.value.toString().length === 10;
    }
    return true;
  }

  ngOnDestroy(): void {}
}
