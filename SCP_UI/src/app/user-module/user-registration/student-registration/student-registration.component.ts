import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../shared/services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  EMAIL_PATTERN,
  File_Size_1,
  GENDER_LIST,
  MOBILE_PATTERN,
  PASSWORD_PATTERN,
  File_Type_Accepted,
} from '../../../common/constants';
import {
  confirmPasswordValidator,
  fileSizeValidator,
  fileType,
  noWhitespaceValidator,
} from '../../../common/form-validations';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map, catchError } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { AuthenticationComponent } from '../../authentication/authentication.component';
import { CommonService } from '../../../shared/services/common.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-student-registration',
  templateUrl: './student-registration.component.html',
  styleUrl: './student-registration.component.scss',
})
export class StudentRegistrationComponent implements OnInit {
  public studentIdCardName: string = '';
  public studentIdCard: any;
  public profilePhotoName: string = '';
  public profilePhoto: any;
  public isSubmitted: boolean = false;
  public genderList: any = GENDER_LIST;
  public config = { format: 'MM-DD-YYYY' };
  public config1 = { format: 'MM-YYYY' };
  // Removed clgNameText since we're switching to ngbTypeahead
  public clgNameList: any = [];
  public streamList: any = [];
  public securityQuestionList: any = [];
  public programList: any = [];
  public email_pattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  public activeTooltip: boolean = false;
  public activeStudentIdTooltip: boolean = false;
  public activeProfilePhotoTooltip: boolean = false;

  public imageType: string = File_Type_Accepted;
  isPwd: boolean = false;
  isCfPwd: boolean = false;

  inviteToken: string | null = null;

  constructor(
    private _fb: FormBuilder,
    private apiService: ApiService,
    public modalService: NgbModal,
    public commonService: CommonService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Capture invite token from query string if present
    this.inviteToken = this.route.snapshot.queryParamMap.get('inviteToken');

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
      institute: ['', Validators.required],
      AICTECode: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      studentId: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          noWhitespaceValidator(),
        ],
      ],
      pragramName: ['', Validators.required],
      courseLevel: [''],
      stream: ['', Validators.required],
      enrollmentYear: ['', Validators.required],
      graduationYear: ['', Validators.required],
      securityQuestion: ['', Validators.required],
      securityAnswer: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          noWhitespaceValidator(),
        ],
      ],
      studentIdCard: ['', Validators.required],
      profilePhoto: ['', Validators.required],
      termsConditions: [false, Validators.requiredTrue],
      privacyPolicy: [false, Validators.requiredTrue],
      cookiePolicy: [false, Validators.requiredTrue],
      refundPolicy: [false, Validators.requiredTrue],
    },
    { validators: [confirmPasswordValidator] }
  );

  // convenience getter for easy access to form fields
  get fieldName() {
    return this.registerForm.controls;
  }

  public async upload(file: any, from: any) {
    const selectedFile = (file && (file.target as HTMLInputElement)).files[0];
    if (from == 'studentId') {
      this.registerForm
        .get('studentIdCard')
        ?.setValidators([
          fileType(selectedFile),
          fileSizeValidator(selectedFile, File_Size_1),
        ]);
      this.registerForm.get('studentIdCard')?.updateValueAndValidity();
      this.studentIdCardName = selectedFile.name;

      // Launch cropper with landscape aspect-ratio suitable for ID cards (e.g. 4:3)
      const bytes = await this.commonService.openImageCropperAndGetBytes(
        selectedFile,
        16 / 8, // 16:10 aspect ratio for ID card
        false    // rectangular cropper
      );

      if (!bytes) {
        // User cancelled cropping – keep previous value
        return;
      }

      this.studentIdCard = bytes;
    } else {
      this.registerForm
        .get('profilePhoto')
        ?.setValidators([
          fileType(selectedFile),
          fileSizeValidator(selectedFile, File_Size_1),
        ]);
      this.registerForm.get('profilePhoto')?.updateValueAndValidity();
      this.profilePhotoName = selectedFile.name;

      // Launch cropper with square aspect-ratio and round preview
      const bytes = await this.commonService.openImageCropperAndGetBytes(
        selectedFile,
        1,   // 1:1 aspect ratio
        true // round cropper
      );

      if (!bytes) {
        // User cancelled cropping – keep previous value
        return;
      }

      this.profilePhoto = bytes;
    }
  }

  public submitForm(): void {
    let grdDate: any;
    let effDate: any;
    if (this.registerForm.controls['graduationYear'].value) {
      let data = this.registerForm.controls['graduationYear'].value.split('-');
      let d = new Date(+data[1], +data[0], 0);
      grdDate = new DatePipe('en-US').transform(d.toString(), 'yyyy-MM-dd');
    }
    if (this.registerForm.controls['enrollmentYear'].value) {
      let data = this.registerForm.controls['enrollmentYear'].value.split('-');
      let d = new Date(+data[1], +data[0], 1);
      effDate = new DatePipe('en-US').transform(d.toString(), 'yyyy-MM-dd');
    }
    this.isSubmitted = true;
    if (this.registerForm.invalid) return;
    // Call the API here
    let payload = {
      courseLevel: this.registerForm.controls['courseLevel'].value,
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
      programName: this.registerForm.controls['pragramName'].value,
      questionId: this.registerForm.controls['securityQuestion'].value,
      role: 'Student',
      securityQuestionAns: this.registerForm.controls['securityAnswer'].value,
      stream: this.registerForm.controls['stream'].value,
      studentId: this.registerForm.controls['studentId'].value,
      idProof: this.studentIdCard ? this.studentIdCard : '',
      profilePhoto: this.profilePhoto ? this.profilePhoto : '',
      city: this.registerForm.controls['city'].value,
      state: this.registerForm.controls['state'].value,
      inviteToken: this.inviteToken ?? undefined,
    };

    console.log(payload);
    this.apiService.addUser([payload]).subscribe({
      next: (res: any) => {
        this.studentIdCard = null;
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

  // Formatters for typeahead items and input
  resultFormatInstitute = (x: any) => x.orgName;
  inputFormatInstitute = (x: any) => x.orgName;

  onInstituteSelected(event: any) {
    const selectedOrg = event.item;
    if (!selectedOrg) return;

    // Preserve selected org for payload
    this.clgNameList = [selectedOrg];

    this.getListProgramName(selectedOrg.orgId);

    this.registerForm.patchValue({
      AICTECode: selectedOrg.aictecode,
      city: selectedOrg.city,
      state: selectedOrg.state,
    });

    this.registerForm.controls['AICTECode'].disable();
    this.registerForm.controls['city'].disable();
    this.registerForm.controls['state'].disable();
  }

  // getText removed – replaced by Typeahead

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
        console.log(this.programList);
      },
      error: (error) => {
        console.log(error.message);
      },
    });
  }

  selectProgram(item: any) {
    let courseLevel = this.programList.find((v: any) => v.programCode == item);
    if (courseLevel) {
      console.log(courseLevel);
      this.getStream(courseLevel.id, this.clgNameList[0]?.orgId);
    }
    this.registerForm.patchValue({
      courseLevel: courseLevel.level,
    });
    this.registerForm.controls['courseLevel'].disable();
  }

  getStream(id: any, orgId: any) {
    this.apiService.getListStream(id, orgId).subscribe({
      next: (res: any) => {
        this.streamList = res.data;
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

  ngOnDestroy(): void {
    // this.clgNameText.complete(); // Removed as per new_code
  }
}
