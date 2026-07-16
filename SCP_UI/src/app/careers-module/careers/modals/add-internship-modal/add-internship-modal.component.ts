import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../../common/common.service';
import { FormBuilder, Validators } from '@angular/forms';
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
  selector: 'app-add-internship-modal',
  templateUrl: './add-internship-modal.component.html',
  styleUrl: './add-internship-modal.component.scss',
  providers: [{ provide: MAT_DATE_FORMATS, useClass: MyFormat }],
})
export class AddInternshipModalComponent implements OnInit {
  @Output() internshipAdded = new EventEmitter<void>();
  public logoName: any;
  public logoNameContent: any;
  public coverPhotoName: any;
  public coverPhotoContent: any;
  public isSubmitted: boolean = false;
  public term = new Subject<string>();
  tagItems: any = [];
  email_pattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  public imageType: string = File_Type_Accepted;
  public maxChars: number = 50;
  public descriptionMaxChars: number = 250;
  public descriptionMaxChars500: number = 500;
  activeCompanyLogoToolTip: boolean = false;
  activeCoverImageToolTip: boolean = false;
  public durationUnit: string = 'Months';
  public durationPreview: string = '';
  public stipendPreview: string = '';
  public today: Date = new Date();
  public headerForm: any;

  constructor(
    public commonService: CommonService,
    private activeModal: NgbActiveModal,
    private _fb: FormBuilder,
    public videoService: VideoService,
    private careerService: CareerService
  ) {
    this.initializeForm();
  }

  private initializeForm() {
    this.headerForm = this._fb.group({
      position: ['', [Validators.required]],
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
      duration: ['', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]+)?$')]],
      stipendAmount: ['', [Validators.required]],
      applyByDate: ['', [Validators.required, futureDateValidator()]],
      companyLogo: ['', [Validators.required]],
      coverPhoto: ['', [Validators.required]],
      skill: ['', [Validators.required]],
      tagging: [[], [Validators.required]],
      durationUnit: ['Months', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.term.pipe(debounceTime(1000)).subscribe((value) => {
      this.getTagsList(value);
    });

    // Subscribe to duration value changes
    this.headerForm.get('duration')?.valueChanges.subscribe((value: string | null) => {
      this.updateDurationPreview(value);
    });

    // Subscribe to duration unit changes
    this.headerForm.get('durationUnit')?.valueChanges.subscribe((value: string) => {
      this.durationUnit = value;
      const durationValue = this.headerForm.get('duration')?.value;
      if (durationValue) {
        this.updateDurationPreview(durationValue);
      }
    });

    // Stipend preview subscription
    this.headerForm.get('stipendAmount')?.valueChanges.subscribe((value: string | null) => {
      this.updateStipendPreview(value);
    });
  }

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
    if (this.headerForm.valid) {
      const duration = parseFloat(this.headerForm.controls['duration'].value || '0');
      const unit = this.headerForm.controls['durationUnit'].value;
      // Convert to singular if duration is 1
      const durationUnit = duration === 1 ? unit.slice(0, -1) : unit;

      let payload = {
        companyDesc: this.headerForm.controls['aboutCompany'].value,
        companyLogo: this.logoNameContent,
        companyName: this.headerForm.controls['companyName'].value,
        contactNo: this.headerForm.controls['contactNumber'].value,
        coverPage: this.coverPhotoContent,
        desc: this.headerForm.controls['description'].value,
        duration: duration,
        durationUnit: durationUnit,
        email: this.headerForm.controls['contactEmail'].value,
        endDate: this.commonService.convertDate(
          this.headerForm.controls['applyByDate'].value
        ),
        location: this.headerForm.controls['workLocation'].value,
        qualification: this.headerForm.controls['qualification'].value,
        startDate: this.commonService.convertDate(
          this.headerForm.controls['startDate'].value
        ),
        stipend: this.headerForm.controls['stipendAmount'].value,
        tags: this.headerForm.controls['tagging'].value
          ? (this.headerForm.controls['tagging'].value as Array<any>).map(
              (val: any) => val.id
            )
          : '',
        title: this.headerForm.controls['position'].value,
        skills: this.headerForm.controls['skill'].value,
      };
      console.log(payload)
      this.careerService.addInternship(payload).subscribe({
        next: (res) => {
          this.coverPhotoContent = null;
          this.logoNameContent = null;
          // Notify list views that a new Internship has been added
          this.careerService.notifyCareerAdded('INTERNSHIP');

          this.commonService.dialog({
            type: 'newSuccessModal',
            header: 'Internship Added Successfully',
            message1: 'Your internship has been published successfully.',
            btnName: 'OK'
          });
          this.activeModal.close(true);
          this.internshipAdded.emit();
        },
      });
    }
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

  updateDurationPreview(value: string | null) {
    if (!value) {
      this.durationPreview = '';
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      this.durationPreview = '';
      return;
    }

    const unit = this.headerForm.get('durationUnit')?.value || 'Months';
    const displayUnit = numValue === 1 ? unit.slice(0, -1) : unit;
    this.durationPreview = `${numValue} ${displayUnit}`;
  }

  updateStipendPreview(value: string | null) {
    if (!value) {
      this.stipendPreview = '';
      return;
    }

    // remove non-digit/decimal
    const num = parseFloat(value.toString().replace(/,/g, ''));
    if (isNaN(num)) {
      this.stipendPreview = '';
      return;
    }

    // Format with commas
    const formatted = num.toLocaleString('en-IN');
    this.stipendPreview = `₹ ${formatted} per Month`;
  }
}
