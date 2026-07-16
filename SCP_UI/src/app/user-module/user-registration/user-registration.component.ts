import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { confirmPasswordValidator } from '../../common/form-validations';
import { GENDER_LIST, PASSWORD_PATTERN } from '../../common/constants';
import { ApiService } from '../../shared/services/api.service';
import { Subject, debounceTime } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationComponent } from '../authentication/authentication.component';
import { CommonService } from '../../shared/services/common.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrl: './user-registration.component.scss',
})
export class UserRegistrationComponent implements OnInit, OnDestroy {
  public studentIdCardName: string = '';
  public studentIdCard: any;
  public profilePhotoName: string = '';
  public profilePhoto: any;
  public isSubmitted: boolean = false;
  public genderList: any = GENDER_LIST;
  config = { format: 'YYYY-MM-DD' };
  config1 = { format: 'MM-YYYY' };
  clgNameText = new Subject<string>();
  clgNameList: any = [];
  streamList: any = [];
  securityQuestionList: any = [];
  programList: any = [];
  public userRoles = ['Student', 'Faculty'];
  public activeUser: any = 'Student';

  constructor(
    private _fb: FormBuilder,
    private apiService: ApiService,
    public modalService: NgbModal,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.getSecurityQuestionsList();
    this.clgNameText.pipe(debounceTime(1000)).subscribe((value) => {
      this.getOrgName(value);
    });
  }

  public registerForm = this._fb.group(
    {
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      mobile: ['', Validators.required],
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
      studentId: ['', Validators.required],
      pragramName: ['', Validators.required],
      courseLevel: [''],
      stream: ['', Validators.required],
      enrollmentYear: ['', Validators.required],
      graduationYear: ['', Validators.required],
      securityQuestion: ['', Validators.required],
      securityAnswer: ['', Validators.required],
      studentIdCard: [''],
      profilePhoto: [''],
      termsConditions: [false, Validators.requiredTrue],
      privacyPolicy: [false, Validators.requiredTrue],
    },
    { validators: [confirmPasswordValidator] }
  );

  // convenience getter for easy access to form fields
  get fieldName() {
    return this.registerForm.controls;
  }

  public async upload(file: any, from: any) {
    if (from == 'studentId') {
      this.studentIdCardName = file.target.files[0].name;
      this.studentIdCard = await this.fileToByteArray(file.target.files[0]);
    } else {
      this.profilePhotoName = file.target.files[0].name;
      this.profilePhoto = await this.fileToByteArray(file.target.files[0]);
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
      dob: this.registerForm.controls['dob'].value,
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
    };

    console.log(payload);
    this.apiService.addUser([payload]).subscribe({
      next: (res: any) => {
        this.studentIdCard = null;
        this.profilePhoto = null;
        this.registerForm.reset();
        this.openAuthModal();
      },
      error: (error) => {
        console.log(error.message);
        this.commonService.dialog('Error', error.message);
      },
    });
  }

  getOrgName(name: string) {
    this.apiService.getListOrgdetailByname(name).subscribe({
      next: (res: any) => {
        console.log(res);
        this.clgNameList = res.data;
        if (this.clgNameList && this.clgNameList.length) {
          // this.streamList = this.clgNameList[0]?.streams;
          this.getListProgramName(this.clgNameList[0]?.orgId);
          this.registerForm.patchValue({
            AICTECode: this.clgNameList[0]?.aictecode,
            city: this.clgNameList[0]?.city,
            state: this.clgNameList[0]?.state,
          });
          this.registerForm.controls['AICTECode'].disable();
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

  activeRegistration(userType: any) {
    this.activeUser = userType;
  }

  ngOnDestroy(): void {
    this.clgNameText.complete();
  }
}
