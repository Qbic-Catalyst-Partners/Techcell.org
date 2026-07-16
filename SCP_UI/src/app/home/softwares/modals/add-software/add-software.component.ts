import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VideoService } from '../../../videos/service/video.service';
import { CommonService } from '../../../../common/common.service';
import { SoftwareService } from '../../service/software.service';
import { Subject, debounceTime } from 'rxjs';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MyFormat } from '../../../../shared/utility/dateFormate';
import { File_Size_1, File_Type_Accepted } from '../../../../common/constants';
import {
  fileSizeValidator,
  fileType,
} from '../../../../common/form-validations';

@Component({
  selector: 'app-add-software',
  templateUrl: './add-software.component.html',
  styleUrl: './add-software.component.scss',
  providers: [{ provide: MAT_DATE_FORMATS, useClass: MyFormat }],
})
export class AddSoftwareComponent implements OnInit {
  public maxChars: number = 50;
  public isSubmitted: boolean = false;
  public fileContent: any;
  public tagList: any = [];
  public applicationName: any = '';
  public displayImageName: any = '';
  public activeDisplayImageTooltip: boolean = false;
  primaryTag: any = [];
  secondoryTag: any = [];
  public term = new Subject<string>();
  tagItems: any = [];
  public imageType: string = File_Type_Accepted;

  public addSoftwareForm = this._fb.group({
    softwareName: ['', [Validators.required]],
    version: ['', [Validators.required, Validators.maxLength(50)]],
    osSupported: ['', [Validators.required, Validators.maxLength(50)]],
    licenceType: ['', Validators.required],
    releaseDate: ['', Validators.required],
    primaryTag: [[], Validators.required],
    // secondaryTag: [[], Validators.required],
    applicationURL: ['', Validators.required],
    displayImageFile: ['', Validators.required],
  });

  constructor(
    private activeModal: NgbActiveModal,
    private _fb: FormBuilder,
    public commonService: CommonService,
    private videoService: VideoService,
    private softwareService: SoftwareService
  ) {}
  ngOnInit(): void {
    this.term.pipe(debounceTime(1000)).subscribe((value) => {
      this.getTagsList(value);
    });
  }

  close() {
    this.activeModal.close();
  }

  get fieldName() {
    return this.addSoftwareForm.controls;
  }

  submitForm() {
    this.isSubmitted = true;
    let payload = {
      licenceType: this.addSoftwareForm.controls['licenceType'].value,
      osSupported: this.addSoftwareForm.controls['osSupported'].value,
      releaseDate: this.commonService.convertDate(
        this.addSoftwareForm.controls['releaseDate'].value
      ),
      softwareName: this.addSoftwareForm.controls['softwareName'].value,
      softwarelink: this.addSoftwareForm.controls['applicationURL'].value,
      thumbnail: this.fileContent,
      version: this.addSoftwareForm.controls['version'].value,
      primaryTag: this.addSoftwareForm.controls['primaryTag'].value
        ? (this.addSoftwareForm.controls['primaryTag'].value as Array<any>)
            .map((val: any) => val.id)
            .join('')
        : '',
    };
    if (this.addSoftwareForm.valid) {
      this.softwareService.addSoftware(payload).subscribe({
        next: (res: any) => {
          this.isSubmitted = false;
          this.commonService.dialog({
            type: 'newSuccessModal',
            message1: 'Software Published Successfully',
            message2: '',
            btnName: 'OK',
            header: 'Submitted'
          });
          // Notify listeners that a Software has been added
          this.softwareService.notifySoftwareAdded();

          this.fileContent = null;
          this.activeModal.close(true);
        },
        error: (err: any) => {
          this.commonService.dialog({
            type: 'newErrorModal',
            message1: 'Failed to publish software, please try again',
            message2: '',
            btnName: 'OK',
            header: 'Error'
          });
        },
      });
    }
  }

  public async uploadApplicationName(file: any) {
    this.applicationName = file.target.files[0].name;
    this.fileContent = await this.commonService.fileToByteArray(
      file.target.files[0]
    );
  }

  public async uploadDisplayImage(file: any) {
    const selectedFile = (file && (file.target as HTMLInputElement)).files[0];
    this.addSoftwareForm
      .get('displayImageFile')
      ?.setValidators([
        fileType(selectedFile),
        fileSizeValidator(selectedFile, File_Size_1),
      ]);
    this.addSoftwareForm.get('displayImageFile')?.updateValueAndValidity();
    this.displayImageName = selectedFile.name;

    const bytes = await this.commonService.openImageCropperAndGetBytes(
      selectedFile,
      16 / 10,
      false
    );

    if (!bytes) {
      return;
    }

    this.fileContent = bytes;
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
}
