import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../shared/services/common.service';
import { VideoService } from '../../../home/videos/service/video.service';
import { CommunityService } from '../../service/community.service';
import { Subject, debounceTime } from 'rxjs';
import {
  File_Size_1,
  File_Size_5,
  File_Type_Accepted,
} from '../../../common/constants';
import { fileSizeValidator, fileType } from '../../../common/form-validations';

@Component({
  selector: 'app-add-community',
  templateUrl: './add-community.component.html',
  styleUrl: './add-community.component.scss',
})
export class AddCommunityComponent implements OnInit {
  public maxChars: number = 50;
  public descriptionMaxChars: number = 250;
  public isSubmitted: boolean = false;
  public profileFileContent: any;
  public coverFileContent: any;
  public tagList: any = [];
  public profilePhotoName: any = '';
  public coverPhotoName: any = '';
  public activeProfilePhotoTooltip: boolean = false;
  public activeCoverPhotoTooltip: boolean = false;
  public config = {
    format: 'YYYY-MM-DD',
    style: 'big',
    multipleYearsNavigateBy: 10,
  };
  public moderatorUserList: any = [];
  public term = new Subject<string>();
  tagItems: any = [];
  public imageType: string = File_Type_Accepted;

  public addSoftwareForm = this._fb.group({
    communityName: ['', [Validators.required]],
    shortDescription: ['', [Validators.required]],
    description: ['', Validators.required],
    assignModerator: [''],
    primaryTag: [[], Validators.required],
    secondaryTag: [[]],
    applicationFile: ['', Validators.required],
    displayImageFile: ['', Validators.required],
  });

  constructor(
    private activeModal: NgbActiveModal,
    private _fb: FormBuilder,
    private commonService: CommonService,
    private videoService: VideoService,
    private communityService: CommunityService
  ) {}
  ngOnInit(): void {
    this.getModeratorUser();
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
      description: this.addSoftwareForm.controls['description'].value,
      shortDescription: this.addSoftwareForm.controls['shortDescription'].value,
      primaryTag: this.addSoftwareForm.controls['primaryTag'].value
        ? (this.addSoftwareForm.controls['primaryTag'].value as Array<any>)
            .map((val: any) => val.id)
            .join('')
        : '',
      tags: this.addSoftwareForm.controls['secondaryTag'].value
        ? (
            this.addSoftwareForm.controls['secondaryTag'].value as Array<any>
          ).map((val: any) => val.id)
        : '',
      title: this.addSoftwareForm.controls['communityName'].value,
      postType: 'COMMUNITY',
      coverPhoto: this.coverFileContent,
      profilePhoto: this.profileFileContent,
      moderator: this.addSoftwareForm.controls['assignModerator'].value,
    };
    console.log(payload);
    if (this.addSoftwareForm.valid) {
      this.communityService.addCommunity(payload).subscribe({
        next: (res: any) => {
          this.isSubmitted = false;
          const infoMsg = res?.result?.info || 'Community Uploaded Successfully!';
          this.commonService.dialog({
            type: 'newSuccessModal',
            message1: infoMsg,
            btnName: 'OK',
            header: 'Community Created'
          });
          // Inform listeners that a new community has been added
          this.communityService.notifyCommunityAdded();

          this.profileFileContent = null;
          this.coverFileContent = null;
          this.activeModal.close(true);
        },
        error: (err: any) => {},
      });
    }
  }

  public async uploadApplicationName(file: any) {
    const selectedFile = (file && (file.target as HTMLInputElement)).files[0];
    this.addSoftwareForm
      .get('applicationFile')
      ?.setValidators([
        fileType(selectedFile),
        fileSizeValidator(selectedFile, File_Size_1),
      ]);
    this.addSoftwareForm.get('applicationFile')?.updateValueAndValidity();
    const originalFile: File = selectedFile;
    this.profilePhotoName = selectedFile?.name;
    // Open cropper with 16:10 aspect ratio (rectangular profile image)
    this.profileFileContent = await this.commonService.openImageCropperAndGetBytes(
      selectedFile,
      16 / 10,
      false
    );
  }

  public async uploadDisplayImage(file: any) {
    const selectedFile: File = (file && (file.target as HTMLInputElement)).files[0];
    this.addSoftwareForm
      .get('displayImageFile')
      ?.setValidators([
        fileType(selectedFile),
        fileSizeValidator(selectedFile, File_Size_5),
      ]);
    this.addSoftwareForm.get('displayImageFile')?.updateValueAndValidity();
    this.coverPhotoName = selectedFile?.name;
    // Use wide aspect ratio (16:9) for cover photo
    this.coverFileContent = await this.commonService.openImageCropperAndGetBytes(
      selectedFile,
      16 / 9
    );
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

  getModeratorUser() {
    this.communityService.getModeratorUser().subscribe({
      next: (res: any) => {
        this.moderatorUserList = res.data;
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
