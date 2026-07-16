import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../../shared/services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../../common/common.service';
import { Router } from '@angular/router';
import { Subject, debounceTime } from 'rxjs';
import { VideoService } from '../../service/video.service';
import { IVideoUpload } from '../../models/video.interface';
import { ValidateUrl } from '../../../../common/form-validations';
import { AuthUtils } from '../../../../shared/utility/auth-utils';

@Component({
  selector: 'app-add-video',
  templateUrl: './add-video.component.html',
  styleUrl: './add-video.component.scss',
})
export class AddVideoComponent {
  public tagName = new Subject<string>();
  public tags: string[] = [];
  public isSubmitted: boolean = false;
  public maxChars: number = 50;
  public descriptionMaxChars: number = 250;

  public videoForm = this._fb.group({
    title: ['', [Validators.required]],
    shortDescription: ['', Validators.required],
    description: ['', Validators.required],
    postType: ['VIDEOS'],
    videoLink: ['', [Validators.required, ValidateUrl]],
    primaryTag: [[], Validators.required],
    secondaryTag: [[]],
  });
  public tagList: any = [];
  public term = new Subject<string>();
  tagItems: any = [];

  constructor(
    private _fb: FormBuilder,
    private apiService: ApiService,
    private videoService: VideoService,
    public modalService: NgbModal,
    private activeModal: NgbActiveModal,
    public commonService: CommonService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.term.pipe(debounceTime(1000)).subscribe((value) => {
      this.getTagsList(value);
    });
  }

  getTags(evt: any) {
    console.log(evt);
    this.videoForm.get('secondaryTag')?.setValue(evt);
  }
  // convenience getter for easy access to form fields
  get fieldName() {
    return this.videoForm.controls;
  }

  submitForm() {
    let uploadData = {
      description: this.videoForm.value.description,
      shortDescription: this.videoForm.value.shortDescription,
      primaryTag: this.videoForm.controls['primaryTag'].value
        ? (this.videoForm.controls['primaryTag'].value as Array<any>)
            .map((val: any) => val.id)
            .join('')
        : '',
      tags: this.videoForm.controls['secondaryTag'].value
        ? (this.videoForm.controls['secondaryTag'].value as Array<any>).map(
            (val: any) => val.id
          )
        : '',
      title: this.videoForm.value.title,
      postType: this.videoForm.value.postType,
      videolink: this.videoForm.value.videoLink,
    };

    this.isSubmitted = true;
    const user = JSON.parse(AuthUtils.getUserDetails() || '');
    const role = user.userDetailResponseDTO.role;

    const dailogMessage =
      role === 'Student' || role === 'Corporate' || role === 'Faculty'
        ? 'Nice Work! Take a deep breath! Your video will be listed once approved'
        : 'Good work! The content will be visible on the portal now';
    if (this.videoForm.invalid) return;
    this.videoService.uploadVideo(uploadData).subscribe({
      next: (res: any) => {
        this.tags = res.data;
        this.isSubmitted = false;
        this.commonService.dialog({
          type: 'newSuccessModal',
          message1: dailogMessage,
          message2: '',
          btnName: 'OK',
          header: 'Submitted'
        });
        // Notify listeners that a Video has been added
        this.videoService.notifyPostingAdded('VIDEOS');
        this.activeModal.close(true);
      },
      error: (error) => {
        this.commonService.dialog({
          type: 'newErrorModal',
          message1: 'Failed to publish Video, please try again',
          message2: '',
          btnName: 'OK',
          header: 'Error'
        });
      },
    });
  }

  close() {
    this.activeModal.close();
  }

  getTagText(event: any) {
    this.tagName.next(event.target.value);
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

  ngOnDestroy(): void {
    this.tagName.complete();
  }
}
