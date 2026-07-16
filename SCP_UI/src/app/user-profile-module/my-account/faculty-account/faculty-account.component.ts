import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  File_Size_1,
  File_Type_Accepted,
  GENDER_LIST,
  PASSWORD_PATTERN,
} from '../../../common/constants';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../../shared/services/common.service';
import { UserprofileService } from '../../service/userprofile.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { AuthenticationComponent } from '../../../user-module/authentication/authentication.component';
import { AuthUtils } from '../../../shared/utility/auth-utils';
import {
  confirmPasswordValidator,
  fileSizeValidator,
  fileType,
} from '../../../common/form-validations';
import { Subject, debounceTime } from 'rxjs';
import { VideoService } from '../../../home/videos/service/video.service';
import moment from 'moment';
import { MyFormat } from '../../../shared/utility/dateFormate';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ForgetPasswordComponent } from '../../../user-module/forget-password/forget-password.component';

@Component({
  selector: 'app-faculty-account',
  templateUrl: './faculty-account.component.html',
  styleUrl: './faculty-account.component.scss',
  providers: [{ provide: MAT_DATE_FORMATS, useClass: MyFormat }],
})
export class FacultyAccountComponent implements OnInit, OnDestroy {
  public profilePhoto: any = '';
  public profilePhotoName: any = '';
  private profilePhotoBytes: number[] | null = null;
  public studentIdCardName: string = '';
  public studentIdCard: any;
  public isTaggingEdit: boolean = false;
  public isConactEdit: boolean = false;
  public isInfoEdit: boolean = false;
  public activeProfilePhotoTooltip: boolean = false;
  favouriteList: any = [];
  favouriteTagList: any = [];
  userDetails: any;
  email_pattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  userContactSubmitted: boolean = false;
  userInfoSubmitted: boolean = false;
  initialFormValues: any;
  initialUserFormValues: any;
  securityQuestionList: any = [];
  programList: any = [];
  streamList: any = [];
  public genderList: any = GENDER_LIST;
  config = {
    format: 'YYYY-MM-DD',
    todayText: 'Oggi',
    style: 'big',
    multipleYearsNavigateBy: 10,
  };
  config1 = { format: 'MM-YYYY' };
  public isPwdEdit: boolean = false;
  userPwdSubmitted: boolean = false;
  public term = new Subject<string>();
  tagItems: any = [];
  selectedItem: any = [];
  public imageType: string = File_Type_Accepted;
  public descriptionMaxChars: number = 250;
  isPwd: boolean = false;
  isCfPwd: boolean = false;
  constructor(
    private _fb: FormBuilder,
    public commonService: CommonService,
    private apiService: ApiService,
    private userProfileService: UserprofileService,
    public modalService: NgbModal,
    private router: Router,
    public videoService: VideoService,
    private matDialog: MatDialog
  ) {}
  ngOnDestroy(): void {
    this.commonService.unSetSubject();
  }

  ngAfterViewInit() {
    // First check - immediate
    this.debugTagInput();

    // Second check - after a slight delay to catch dynamically loaded elements
    setTimeout(() => {
      this.debugTagInput();
    }, 500);
  }

  private debugTagInput() {
    const inputs = document.querySelectorAll('tag-input-form');
    console.log('Found tag input elements:', inputs);
    console.log('Number of elements found:', inputs.length);

    // If elements are found, log their current computed styles
    if (inputs.length > 0) {
      inputs.forEach((input, index) => {
        console.log(
          `Element ${index} current width:`,
          window.getComputedStyle(input).getPropertyValue('width')
        );

        // Try applying the style directly
        (input as HTMLElement).style.width = '100%';
        console.log(`Set width to 100% for element ${index}`);
      });
    }
  }

  public userInfoForm: any = this._fb.group({
    firstName: ['', Validators.required],
    lastname: ['', Validators.required],
    gender: [''],
    dob: [''],
    city: [''],
    state: [''],
    securityQuestion: [''],
    securityAnswer: ['', Validators.required],
    linkedinProfile: ['', Validators.required],
    collegeName: [''],
    aicteCode: [''],
    studentId: ['', Validators.required],
    programName: [''],
    courseLevel: [''],
    stream: [''],
    enrolmentYear: [''],
    graduationYear: [''],
    designation: ['', Validators.required],
    photo: [''],
    aboutMe: [''],
  });

  public userContactInfoForm: any = this._fb.group({
    email: ['', [Validators.required, Validators.pattern(this.email_pattern)]],
    mobileNo: [
      '',
      [Validators.required, Validators.minLength(10), Validators.maxLength(10)],
    ],
  });

  public userPwdInfoForm: any = this._fb.group(
    {
      password: [
        '',
        [Validators.required, Validators.pattern(PASSWORD_PATTERN)],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: [confirmPasswordValidator] }
  );

  ngOnInit(): void {
    this.getUserDetails();
    this.getSecurityQuestionsList();
    this.getFavouriteList();
    this.userContactInfoForm.disable();
    this.userInfoForm.disable();
    this.userPwdInfoForm.disable();

    this.term.pipe(debounceTime(1000)).subscribe((value) => {
      this.getTagsList(value);
    });
  }

  getUserDetails(isSet: boolean = false) {
    this.userProfileService.getUserDetail().subscribe({
      next: (res) => {
        this.userDetails = {
          ...res.data?.userDetailResponseDTO,
          ...res.data?.orgDetail,
        };
        console.log(this.userDetails);
        this.profilePhoto = `data:image/jpeg;charset=utf-8;base64,${this.userDetails?.profilePhoto}`;
        this.patchContactInfo(this.userDetails);
        this.patchUserInfo(this.userDetails);
        if (isSet) {
          AuthUtils.setUserDetails(res.data);
          this.commonService.setValue(true);
        }
      },
    });
  }

  public async upload(file: any, from: any) {
    const selectedFile = (file && (file.target as HTMLInputElement)).files[0];
    this.userInfoForm
      .get('photo')
      ?.setValidators([
        fileType(selectedFile),
        fileSizeValidator(selectedFile, File_Size_1),
      ]);
    this.userInfoForm.get('photo')?.updateValueAndValidity();
    this.profilePhotoName = file.target.files[0].name;

    const bytes = await this.commonService.openImageCropperAndGetBytes(selectedFile, 1, true);
    if (!bytes) {
      return;
    }
    this.profilePhotoBytes = bytes;

    const reader = new FileReader();
    reader.onload = () => (this.profilePhoto = reader.result as string);
    reader.readAsDataURL(selectedFile);

    // immediate update
    this.userProfileService.updateProfilePhoto({ profilePhoto: this.profilePhotoBytes }).subscribe({
      next: () => {
        this.commonService.dialog('newSuccessModal', 'Profile photo updated successfully', '', 'OK', 'Success');
        this.profilePhotoName = '';
        this.userInfoForm.get('photo')?.reset('');
        this.userInfoForm.get('photo')?.clearValidators();
        this.userInfoForm.get('photo')?.updateValueAndValidity();
        this.getUserDetails(true);
      },
      error: (err) => {
        this.commonService.dialog('newErrorModal', err.message || 'Error updating profile photo', '', 'OK', 'Error');
      },
    });
  }

  public enableEdit(type: any, isEnable: boolean) {
    switch (type) {
      case 'edit':
        isEnable ? this.userInfoForm.enable() : this.userInfoForm.disable();
        this.isInfoEdit = isEnable;
        if (!isEnable) {
          this.patchUserInfo(this.userDetails);
          this.studentIdCardName = '';
          this.profilePhotoName = '';
        } else {
          this.disabledUserField();
        }
        break;
      case 'edit-contact':
        isEnable
          ? this.userContactInfoForm.enable()
          : this.userContactInfoForm.disable();
        this.isConactEdit = isEnable;
        if (!isEnable) {
          this.patchContactInfo(this.userDetails);
        }
        break;
      case 'content-tagging':
        this.isTaggingEdit = isEnable;
        if (!this.isTaggingEdit) {
          this.favouriteTagList = [...this.favouriteList];
          this.selectedItem = [];
        }
        break;
      case 'edit-pwd':
        this.isPwdEdit = isEnable;
        isEnable
          ? this.userPwdInfoForm.enable()
          : this.userPwdInfoForm.disable();
        if (!isEnable) {
          this.userPwdInfoForm.reset();
          this.isPwd = false;
          this.isCfPwd = false;
        }
        break;
    }
  }

  public submitUserInfoForm(): void {
    // console.log(this.userInfoForm.value);
    this.userInfoSubmitted = true;
    if (this.userInfoForm.valid) {
      let payload = {
        courseLevel: '',
        dob: moment(this.userInfoForm.controls['dob'].value).format(
          'YYYY-MM-DD'
        ),
        effectiveDate: '',
        emailId: this.userDetails?.emailId,
        firstName: this.userInfoForm.controls['firstName'].value,
        gender: this.userInfoForm.controls['gender'].value,
        graduationCompletiondate: '',
        idProof: this.studentIdCardName ? this.studentIdCard : '',
        lastName: this.userInfoForm.controls['lastname'].value,
        mobileNo: this.userDetails?.mobileNo,
        profilePhoto: this.profilePhotoName ? this.profilePhoto : '',
        programName: '',
        questionId: this.userInfoForm.controls['securityQuestion'].value,
        securityQuestionAns: this.userInfoForm.controls['securityAnswer'].value,
        stream: '',
        facultyId: this.userInfoForm.controls['studentId'].value,
        designation: this.userInfoForm.controls['designation'].value,
        linkedinProfile: this.userInfoForm.controls['linkedinProfile'].value,
        description: this.userInfoForm.controls['aboutMe'].value,
      };
      // console.log(payload)
      this.userProfileService.updateUser(payload).subscribe({
        next: (res) => {
          this.getUserDetails(true);
          this.enableEdit('edit', false);
          this.isInfoEdit = false;
          this.commonService.dialog(
            'newSuccessModal',
            'Your profile has been successfully updated.',
            '',
            'OK',
            'Success'
          );
        },
        error: (error) => {
          this.commonService.dialog('newErrorModal', error.message, '', 'OK', 'Error');
        },
      });
    }
  }
  public submitContactForm(): void {
    console.log(this.userContactInfoForm.value);
    this.userContactSubmitted = true;
    if (this.userContactInfoForm.valid) {
      this.userProfileService.generateOtp().subscribe({
        next: () => {
          this.openAuthModal();
        },
        error: (error) => {
          this.commonService.dialog('newErrorModal', error.message, '', 'OK', 'Error');
        },
      });
    }
  }

  getFavouriteList() {
    this.apiService.getMyFavouriteTagList().subscribe({
      next: (response: any) => {
        this.favouriteList = response.data;
        this.favouriteTagList = response.data;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  removeTag(item: any) {
    this.favouriteTagList = this.favouriteTagList.filter(
      (v: any) => v.id != item.id
    );
  }

  get isValidTagging() {
    return (
      !this.selectedItem.length &&
      this.favouriteTagList.length == this.favouriteList.length
    );
  }

  updateTag() {
    let difference = this.favouriteList.filter(
      (v: any) => !this.favouriteTagList.some((e: any) => v.id == e.id)
    );
    // console.log(difference);
    if (difference && difference.length) {
      let ids = difference.map((v: any) => `hashTagList=${v.id}`).join('&');
      console.log(ids);
      this.userProfileService.deleteFavTagList(ids).subscribe({
        next: () => {
          this.getFavouriteList();
          this.enableEdit('content-tagging', false);
          this.isTaggingEdit = false;
          this.commonService.dialog(
            'newSuccessModal',
            'Your TagList has been successfully updated.',
            '',
            'OK',
            'Success'
          );
        },
        error: (error) => {
          this.commonService.dialog('newErrorModal', error.message, '', 'OK', 'Error');
        },
      });
    }

    if (this.selectedItem && this.selectedItem.length) {
      let ids = this.selectedItem
        .map((v: any) => `hashTagList=${v.id}`)
        .join('&');
      this.userProfileService.addFavTagList(ids).subscribe({
        next: (res: any) => {
          this.getFavouriteList();
          this.enableEdit('content-tagging', false);
          this.isTaggingEdit = false;
          this.selectedItem = [];
        },
      });
    }
  }

  patchContactInfo(formValue: any) {
    this.userContactInfoForm.patchValue({
      email: formValue.emailId,
      mobileNo: formValue.mobileNo,
    });
    this.initialFormValues = this.userContactInfoForm.value;
  }

  get contactFormHasChanged(): boolean {
    return (
      !!this.initialFormValues &&
      Object.entries(this.initialFormValues).some(
        ([field, value]) => value !== this.userContactInfoForm.value[field]
      )
    );
  }

  get userFormHasChanged(): boolean {
    return (
      !!this.initialUserFormValues &&
      Object.entries(this.initialUserFormValues).some(
        ([field, value]) => value !== this.userInfoForm.value[field]
      )
    );
  }

  get userContactValid() {
    return this.userContactInfoForm['controls'];
  }

  get userInfoValid() {
    return this.userInfoForm['controls'];
  }

  get isValidUserContactForm() {
    return !(this.userContactInfoForm.valid && this.contactFormHasChanged);
  }

  get isValidUserForm() {
    return !(this.userInfoForm.valid && this.userFormHasChanged);
  }

  patchUserInfo(formValue: any) {
    this.userInfoForm.patchValue({
      firstName: formValue?.firstName,
      lastname: formValue?.lastName,
      gender: formValue?.gender,
      dob: formValue?.dob,
      // newPassword: 'Asu@1234',
      // confirmPassword: 'Asu@1234',
      city: formValue?.city,
      state: formValue?.state,
      securityQuestion: formValue?.securityQuestion?.questionId,
      securityAnswer: formValue?.securityAns,
      collegeName: formValue?.orgName,
      aicteCode: formValue?.aictecode,
      studentId: formValue?.facultyId,
      programName: '',
      courseLevel: '',
      stream: '',
      enrolmentYear: '',
      graduationYear: '',
      designation: formValue?.designation,
      linkedinProfile: formValue?.linkedinProfile,
      aboutMe: formValue?.description,
    });
    this.initialUserFormValues = this.userInfoForm.value;
  }

  disabledUserField() {
    this.userInfoForm.controls['collegeName'].disable();
    this.userInfoForm.controls['aicteCode'].disable();
    this.userInfoForm.controls['city'].disable();
    this.userInfoForm.controls['state'].disable();
    this.patchUserInfo(this.userDetails);
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
      email: this.userContactInfoForm.controls.email.value,
      mobile: this.userContactInfoForm.controls.mobileNo.value,
      message: false,
      isOldEmail: true,
      OldEmail: this.userDetails?.emailId,
      navigate: false,
    };
    modalRef.componentInstance.viewData = data;
    modalRef.result.then((response) => {
      if (response) {
        this.updateContact();
      }
    });
  }

  updateContact() {
    let payload = {
      emailId: this.userContactInfoForm.controls['email'].value,
      mobileNo: this.userContactInfoForm.controls['mobileNo'].value,
    };
    // console.log(payload)
    this.userProfileService.updateUser(payload).subscribe({
      next: () => {
        this.getUserDetails();
        this.enableEdit('edit-contact', false);
        this.isConactEdit = false;
        this.commonService.dialog(
          'newSuccessModal',
          'Your Email ID & Mobile Number has been successfully Updated.',
          '',
          'OK',
          'Success'
        );
      },
      error: (error) => {
        this.commonService.dialog('newErrorModal', error.message, '', 'OK', 'Error');
      },
    });
  }

  ngAfterViewChecked() {
    const el1 = document.getElementById('Login-navigate');
    if (el1) {
      el1.onclick = () => this.openAlert();
    }
  }

  openAlert() {
    this.router.navigate(['/']);
    this.modalService.dismissAll();
  }

  submitPwdForm() {
    this.userPwdSubmitted = true;
    let payload = {
      emailId: this.userDetails?.emailId,
      password: this.userPwdInfoForm.controls['password'].value,
    };
    if (this.userPwdInfoForm.valid) {
      this.apiService.resetPassword(payload).subscribe({
        next: (res: any) => {
          this.enableEdit('edit-pwd', false);
          this.isPwdEdit = false;
          this.userPwdInfoForm.reset();
          this.commonService.dialog(
            'newSuccessModal',
            'Your password has been successfully updated.',
            '',
            'OK',
            'Success'
          );
        },
        error: (error) => {
          this.commonService.dialog('newErrorModal', error.message, '', 'OK', 'Error');
        },
      });
    }
  }

  get isValidUserPwdForm() {
    return !this.userPwdInfoForm.valid;
  }

  get userPwdValid() {
    return this.userPwdInfoForm['controls'];
  }

  getTagsList(term: string) {
    this.videoService.getHashTagList(term).subscribe({
      next: (res: any) => {
        this.tagItems = [...res.data];
      },
      error: (error: any) => {
        console.log(error.message);
      },
    });
  }

  getText(event: any) {
    this.term.next(event.target.value);
  }

  onChangeAnswer() {
    this.userInfoForm.controls['securityAnswer'].reset();
  }

  get fieldName() {
    return this.userInfoForm.controls;
  }

  /** Opens the forgot-password verification flow */
  openForgotPasswordModal(): void {
    if (!this.userDetails?.emailId) {
      return;
    }
    const dialogRef = this.matDialog.open(ForgetPasswordComponent, {
      disableClose: true,
      panelClass: ['forgot-password-dialog', 'forgot-password-width'],
      data: { email: this.userDetails.emailId },
    });

    dialogRef.afterClosed().subscribe((verified: boolean) => {
      if (verified) {
        this.enableEdit('edit-pwd', true);
      }
    });
  }

  togglePwd() {
    this.isPwd = !this.isPwd;
  }

  toggleCnfPwd() {
    this.isCfPwd = !this.isCfPwd;
  }
}
