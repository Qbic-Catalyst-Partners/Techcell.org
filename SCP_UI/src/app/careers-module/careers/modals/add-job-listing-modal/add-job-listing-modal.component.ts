import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../../common/common.service';
import { Subject, debounceTime } from 'rxjs';
import { VideoService } from '../../../../home/videos/service/video.service';
import { CareerService } from '../../../career.service';
import { MyFormat } from '../../../../shared/utility/dateFormate';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import {
  File_Size_1,
  File_Size_5,
  File_Type_Accepted,
  MOBILE_PATTERN,
} from '../../../../common/constants';
import {
  fileSizeValidator,
  fileType,
  futureDateValidator,
} from '../../../../common/form-validations';

@Component({
  selector: 'app-add-job-listing-modal',
  templateUrl: './add-job-listing-modal.component.html',
  styleUrl: './add-job-listing-modal.component.scss',
  providers: [{ provide: MAT_DATE_FORMATS, useClass: MyFormat }],
})
export class AddJobListingModalComponent implements OnInit {
  @Output() jobListingAdded = new EventEmitter<void>();
  public logoName: any;
  public logoNameContent: any;
  public coverPhotoName: any;
  public coverPhotoContent: any;
  public isSubmitted: boolean = false;
  email_pattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  public term = new Subject<string>();
  tagItems: any = [];
  public imageType: string = File_Type_Accepted;
  public maxChars: number = 50;
  public descriptionMaxChars: number = 250;
  public descriptionMaxChars500: number = 500;
  activeCompanyLogoToolTip: boolean = false;
  activeCoverImageToolTip: boolean = false;
  public expUnit: string = 'Years';
  public durationPreview: string = '';
  public ctcPreview: string = '';
  public today: Date = new Date();

  constructor(
    public commonService: CommonService,
    private activeModal: NgbActiveModal,
    private _fb: FormBuilder,
    public videoService: VideoService,
    private careerService: CareerService
  ) {}
  ngOnInit(): void {
    this.term.pipe(debounceTime(1000)).subscribe((value) => {
      this.getTagsList(value);
    });

    // Subscribe to experience value changes
    this.headerForm.get('minExp')?.valueChanges.subscribe((value: string | null) => {
      this.updateExpPreview(value);
    });

    // Subscribe to unit changes
    this.headerForm.get('expUnit')?.valueChanges.subscribe((value: string | null) => {
      this.expUnit = value || 'Years';
      const expVal = this.headerForm.get('minExp')?.value;
      if (expVal) {
        this.updateExpPreview(expVal);
      }
    });

    // CTC preview subscriptions
    this.headerForm.get('ctcFrom')?.valueChanges.subscribe(() => this.updateCtcPreview());
    this.headerForm.get('ctcTo')?.valueChanges.subscribe(() => this.updateCtcPreview());
  }

  public headerForm = this._fb.group({
    designation: ['', [Validators.required]],
    description: ['', [Validators.required]],
    companyName: ['', [Validators.required]],
    aboutCompany: ['', [Validators.required]],
    contactNumber: [
      '',
      [Validators.required, Validators.pattern(MOBILE_PATTERN)],
    ],
    contactEmail: [
      '',
      [Validators.required, Validators.pattern(this.email_pattern)],
    ],
    workLocation: ['', [Validators.required]],
    qualification: ['', [Validators.required]],
    startDate: ['', [Validators.required, futureDateValidator()]],
    applyByDate: ['', [Validators.required, futureDateValidator()]],
    companyLogo: ['', [Validators.required]],
    coverPhoto: ['', [Validators.required]],
    tagging: [[], [Validators.required]],
    skill: ['', [Validators.required]],
    minExp: ['', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]+)?$')]],
    expUnit: ['Years', [Validators.required]],
    jobType: ['', [Validators.required]],
    ctcFrom: ['', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]+)?$')]],
    ctcTo: ['', [Validators.pattern('^[0-9]+(\\.[0-9]+)?$')]],
  });

  get fieldName() {
    return this.headerForm.controls;
  }

  public close(): any {
    this.activeModal.close();
  }

  public async uploadCompanyLogo(file: any) {
    const selectedFile = (file && (file.target as HTMLInputElement)).files[0];
    if (selectedFile) {
      this.headerForm
        .get('companyLogo')
        ?.setValidators([
          Validators.required,
          fileSizeValidator(selectedFile, File_Size_1),
          fileType(selectedFile)
        ]);
      this.headerForm.get('companyLogo')?.updateValueAndValidity({ emitEvent: true });
      this.logoName = selectedFile.name;
      this.logoNameContent = await this.commonService.fileToByteArray(selectedFile);
    }
  }

  public async uploadCoverPhoto(file: any) {
    const selectedFile = (file && (file.target as HTMLInputElement)).files[0];
    if (selectedFile) {
      this.headerForm
        .get('coverPhoto')
        ?.setValidators([
          Validators.required,
          fileSizeValidator(selectedFile, File_Size_1),
          fileType(selectedFile)
        ]);
      this.headerForm.get('coverPhoto')?.updateValueAndValidity({ emitEvent: true });
      this.coverPhotoName = selectedFile.name;

      const bytes = await this.commonService.openImageCropperAndGetBytes(
        selectedFile,
        16 / 10,
        false
      );

      if (!bytes) {
        return;
      }

      this.coverPhotoContent = bytes;
    }
  }

  public submitData(): any {
    this.isSubmitted = true;
    // Basic validation: if ctcTo provided without ctcFrom
    if (!this.headerForm.controls['ctcFrom'].value && this.headerForm.controls['ctcTo'].value) {
      this.headerForm.controls['ctcFrom'].setErrors({ required: true });
      return;
    }
    if (this.headerForm.valid) {
      const ctcFromVal = this.headerForm.controls['ctcFrom'].value;
      const ctcToVal = this.headerForm.controls['ctcTo'].value;
      const minExp = parseFloat(this.headerForm.controls['minExp'].value || '0');
      const unitSel = this.headerForm.controls['expUnit'].value || 'Years';
      const expUnit = minExp === 1 ? unitSel.slice(0, -1) : unitSel;

      let payload = {
        companyDesc: this.headerForm.controls['aboutCompany'].value,
        companyLogo: this.logoNameContent,
        companyName: this.headerForm.controls['companyName'].value,
        contactNo: this.headerForm.controls['contactNumber'].value,
        coverPage: this.coverPhotoContent,
        ctc: ctcFromVal,
        ctcTo: ctcToVal,
        desc: this.headerForm.controls['description'].value,
        email: this.headerForm.controls['contactEmail'].value,
        endDate: this.commonService.convertDate(
          this.headerForm.controls['applyByDate'].value
        ),
        location: this.headerForm.controls['workLocation'].value,
        qualification: this.headerForm.controls['qualification'].value,
        startDate: this.commonService.convertDate(
          this.headerForm.controls['startDate'].value
        ),
        tags: this.headerForm.controls['tagging'].value
          ? (this.headerForm.controls['tagging'].value as Array<any>).map(
              (val: any) => val.id
            )
          : '',
        designation: this.headerForm.controls['designation'].value,
        experiance: minExp,
        experianceUnit: expUnit,
        jobType: this.headerForm.controls['jobType'].value,
        skills: this.headerForm.controls['skill'].value,
      };
      console.log(payload);
      this.careerService.addJob(payload).subscribe({
        next: (res) => {
          this.coverPhotoContent = null;
          this.logoNameContent = null;
          // Notify list views that a new Job has been added
          this.careerService.notifyCareerAdded('JOB');
          this.commonService.dialog({
            type: 'newSuccessModal',
            header: 'Job Listing Added Successfully',
            message1: 'Your job listing has been published successfully.',
            btnName: 'OK'
          });
          this.activeModal.close(true);
          this.jobListingAdded.emit();
        },
      });
    }
    // console.log(this.headerForm.value);
  }

  getText(event: any) {
    this.term.next(event.target.value);
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

  updateExpPreview(value: string | null) {
    if (!value) {
      this.durationPreview = '';
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      this.durationPreview = '';
      return;
    }

    const unit = this.headerForm.get('expUnit')?.value || 'Years';
    const displayUnit = numValue === 1 ? unit.slice(0, -1) : unit;
    this.durationPreview = `${numValue} ${displayUnit}`;
  }

  updateCtcPreview() {
    const fromVal = this.headerForm.controls['ctcFrom'].value;
    const toVal = this.headerForm.controls['ctcTo'].value;
    if (!fromVal) {
      this.ctcPreview = '';
      return;
    }
    if (toVal) {
      this.ctcPreview = `${fromVal} - ${toVal} Lakhs per Annum`;
    } else {
      this.ctcPreview = `${fromVal} Lakhs per Annum`;
    }
  }
}
