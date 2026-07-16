import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../../../common/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject, debounceTime } from 'rxjs';
import { VideoService } from '../../../../home/videos/service/video.service';
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
import { CareerService } from '../../../career.service';

@Component({
  selector: 'app-add-project-modal',
  templateUrl: './add-project-modal.component.html',
  styleUrl: './add-project-modal.component.scss',
  providers: [{ provide: MAT_DATE_FORMATS, useClass: MyFormat }],
})
export class AddProjectModalComponent implements OnInit {
  @Output() projectAdded = new EventEmitter<void>();
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
  public durationUnit: string = 'Months';
  public durationPreview: string = '';
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

    // Update preview on duration value change
    this.headerForm.get('duration')?.valueChanges.subscribe((value: string | null) => {
      this.updateDurationPreview(value);
    });

    // Update preview when unit changes
    this.headerForm.get('durationUnit')?.valueChanges.subscribe((value: string | null) => {
      this.durationUnit = value || 'Months';
      const durationVal = this.headerForm.get('duration')?.value;
      if (durationVal) {
        this.updateDurationPreview(durationVal);
      }
    });
  }

  public headerForm = this._fb.group({
    title: ['', [Validators.required]],
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
    startDate: ['', [Validators.required, futureDateValidator()]],
    duration: ['', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]+)?$')]],
    durationUnit: ['Months', [Validators.required]],
    applyByDate: ['', [Validators.required, futureDateValidator()]],
    companyLogo: ['', [Validators.required]],
    coverPhoto: ['', [Validators.required]],
    tagging: [[], [Validators.required]],
    teamCount: ['', [Validators.required]],
    teamSize: ['', [Validators.required]],
    skill: ['', [Validators.required]],
  });

  get fieldName() {
    return this.headerForm.controls;
  }

  public close(): any {
    this.isSubmitted = false;
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
      const unitSel = this.headerForm.controls['durationUnit'].value || 'Months';
      const durationUnit = duration === 1 ? unitSel.slice(0, -1) : unitSel;

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
        startDate: this.commonService.convertDate(
          this.headerForm.controls['startDate'].value
        ),
        tags: this.headerForm.controls['tagging'].value
          ? (this.headerForm.controls['tagging'].value as Array<any>).map(
              (val: any) => val.id
            )
          : '',
        title: this.headerForm.controls['title'].value,
        skills: this.headerForm.controls['skill'].value,
        teamCount: this.headerForm.controls['teamCount'].value,
        teamSize: this.headerForm.controls['teamSize'].value,
      };
      console.log(payload);
      this.careerService.addProject(payload).subscribe({
        next: (res) => {
          this.coverPhotoContent = null;
          this.logoNameContent = null;
          // Notify list views that a new Project has been added
          this.careerService.notifyCareerAdded('PROJECT');
          this.commonService.dialog({
            type: 'newSuccessModal',
            header: 'Project Added Successfully',
            message1: 'Your project has been published successfully.',
            btnName: 'OK'
          });
          this.activeModal.close(true);
          this.projectAdded.emit();
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
}
