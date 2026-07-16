import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';
import { CommonService } from '../../../../common/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
  selector: 'app-add-certification-modal',
  templateUrl: './add-certification-modal.component.html',
  styleUrl: './add-certification-modal.component.scss',
  providers: [{ provide: MAT_DATE_FORMATS, useClass: MyFormat }],
})
export class AddCertificationModalComponent implements OnInit {
  @Output() certificationAdded = new EventEmitter<void>();
  public isSubmitted: boolean = false;
  email_pattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  public term = new Subject<string>();
  tagItems: any = [];
  public logoName: any;
  public logoNameContent: any;
  public imageType: string = File_Type_Accepted;
  public coverPhotoName: any;
  public coverPhotoContent: any;
  public maxChars: number = 50;
  public descriptionMaxChars: number = 250;
  activeCompanyLogoToolTip: boolean = false;
  activeCoverImageToolTip: boolean = false;
  public durationUnit: string = 'Months';
  public durationPreview: string = '';
  public certFeePreview: string = '';
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

    // Subscribe to duration value changes
    this.headerForm.get('duration')?.valueChanges.subscribe((value: string | null) => {
      this.updateDurationPreview(value);
    });

    // Subscribe to duration unit changes
    this.headerForm.get('durationUnit')?.valueChanges.subscribe((value: string | null) => {
      if (value) {
        this.durationUnit = value;
        const durationValue = this.headerForm.get('duration')?.value;
        if (durationValue) {
          this.updateDurationPreview(durationValue);
        }
      }
    });

    // Certification fee preview subscription
    this.headerForm.get('certificationFee')?.valueChanges.subscribe((value: string | null) => {
      this.updateCertFeePreview(value);
    });
  }

  public headerForm = this._fb.group({
    certificationName: ['', [Validators.required]],
    description: ['', [Validators.required]],
    eligibility: ['', [Validators.required]],
    field: ['', [Validators.required]],
    duration: ['', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]+)?$')]],
    durationUnit: ['Months', [Validators.required]],
    mode: ['', [Validators.required]],
    certificationFee: ['', [Validators.required]],
    applyByDate: ['', [Validators.required, futureDateValidator()]],
    tagging: [[], [Validators.required]],
    companyLogo: ['', [Validators.required]],
    coverPhoto: ['', [Validators.required]],
    contactNumber: [
      '',
      [Validators.required, Validators.pattern(MOBILE_PATTERN)],
    ],
    contactEmail: [
      '',
      [Validators.required, Validators.pattern(this.email_pattern)],
    ],
  });

  get fieldName() {
    return this.headerForm.controls;
  }

  public close(): any {
    this.activeModal.close();
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

  public submitData(): any {
    this.isSubmitted = true;
    if (this.headerForm.valid) {
      const duration = parseFloat(this.headerForm.controls['duration'].value || '0');
      const unit = this.headerForm.controls['durationUnit'].value || 'Months';
      // Convert to singular if duration is 1
      const durationUnit = duration === 1 ? unit.slice(0, -1) : unit;

      let payload = {
        desc: this.headerForm.controls['description'].value,
        contactNo: this.headerForm.controls['contactNumber'].value,
        email: this.headerForm.controls['contactEmail'].value,
        title: this.headerForm.controls['certificationName'].value,
        eligibility: this.headerForm.controls['eligibility'].value,
        field: this.headerForm.controls['field'].value,
        duration: duration,
        durationUnit: durationUnit,
        mode: this.headerForm.controls['mode'].value,
        certFee: this.headerForm.controls['certificationFee'].value,
        startDate: this.commonService.convertDate(
          this.headerForm.controls['applyByDate'].value
        ),
        endDate: '2024-07-27T05:46:04.012Z',
        coverPage: this.coverPhotoContent,
        certLogo: this.logoNameContent,
        tags: this.headerForm.controls['tagging'].value
          ? (this.headerForm.controls['tagging'].value as Array<any>).map(
              (val: any) => val.id
            )
          : '',
      };
      console.log(payload);
      this.careerService.addCertification(payload).subscribe({
        next: (res) => {
          // Notify list views that a new Certification has been added
          this.careerService.notifyCareerAdded('CERTIFICATION');
          this.certificationAdded.emit();
          this.commonService.dialog({
            type: 'newSuccessModal',
            header: 'Certification Added Successfully',
            message1: 'Your certification has been published successfully.',
            btnName: 'OK'
          });
          this.activeModal.close(true);
        },
      });
    }
    // console.log(this.headerForm.value);
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
        // User cancelled cropping – do not overwrite previous value
        return;
      }

      this.coverPhotoContent = bytes;
    }
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

  updateCertFeePreview(value: string | null) {
    if (!value) {
      this.certFeePreview = '';
      return;
    }

    const num = parseFloat(value.toString().replace(/,/g, ''));
    if (isNaN(num)) {
      this.certFeePreview = '';
      return;
    }

    const formatted = num.toLocaleString('en-IN');
    this.certFeePreview = `₹ ${formatted}`;
  }
}
