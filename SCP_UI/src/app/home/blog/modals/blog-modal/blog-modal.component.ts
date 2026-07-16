import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthUtils } from '../../../../shared/utility/auth-utils';
import { CommonService } from '../../../../shared/services/common.service';
import { VideoService } from '../../../videos/service/video.service';
import { Subject, debounceTime, interval, Subscription } from 'rxjs';
import { File_Size_1, File_Type_Accepted } from '../../../../common/constants';
import {
  fileSizeValidator,
  fileType,
} from '../../../../common/form-validations';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Observable } from 'rxjs';
import { HttpResponse, HttpEvent } from '@angular/common/http';

@Component({
  selector: 'app-blog-modal',
  templateUrl: './blog-modal.component.html',
  styleUrl: './blog-modal.component.scss',
})
export class BlogModalComponent implements OnInit, AfterViewInit, OnDestroy {
  thubnilName: any;
  isSubmitted: boolean = false;
  fileContent: any;
  tagList: any = [];
  public term = new Subject<string>();
  tagItems: any = [];
  public maxChars: number = 50;
  public descriptionMaxChars: number = 250;
  public imageType: string = File_Type_Accepted;
  activeThumbnailTooltip: boolean = false;

  @ViewChild('blogEditor', { static: true }) blogEditor!: ElementRef;
  private currentHandle: HTMLElement | null = null;
  private currentImage: HTMLImageElement | null = null;

  // keep-alive subscription
  private keepAliveSub?: Subscription;

  public blogForm = this._fb.group({
    title: ['', [Validators.required]],
    shortDescription: ['', Validators.required],
    description: ['', Validators.required],
    blogContent: ['', Validators.required],
    tags: [[], Validators.required],
    secondaryTag: [[]],
    thumbnail: ['', Validators.required],
  });

  public editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '15rem',
    placeholder: 'Enter text here...',
    sanitize: false,
    uploadWithCredentials: false,
    upload: (file: File) => this.uploadImage(file),
   
    toolbarHiddenButtons: [['insertVideo', 'toggleEditorMode']]
  };

  constructor(
    private activeModal: NgbActiveModal,
    private _fb: FormBuilder,
    private commonService: CommonService,
    private videoService: VideoService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.term.pipe(debounceTime(1000)).subscribe((value) => {
      this.getTagsList(value);
    });

    // start keep-alive ping every 5 minutes to prevent idle logout
    this.keepAliveSub = interval(300000).subscribe(() => {
      this.videoService.getMyAccess().subscribe({
        // ignore response; this call only refreshes lastSignInDate on backend
        next: () => {},
        error: () => {},
      });
    });
  }

  ngAfterViewInit(): void {
    const editable: HTMLElement | null = this.blogEditor?.nativeElement?.querySelector(
      '.angular-editor-textarea'
    );
    if (!editable) return;

    // Click listener to attach resizer to selected image
    this.renderer.listen(editable, 'click', (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target && target.tagName === 'IMG') {
        this.attachResizeHandle(target as HTMLImageElement);
      } else if (this.currentHandle && target !== this.currentHandle) {
        this.removeResizeHandle();
      }
    });
  }

  close() {
    if (this.keepAliveSub) {
      this.keepAliveSub.unsubscribe();
    }
    this.activeModal.close();
  }

  get fieldName() {
    return this.blogForm.controls;
  }

  submitForm() {
    this.isSubmitted = true;
    let payload = {
      description: this.blogForm.controls['description'].value,
      shortDescription: this.blogForm.controls['shortDescription'].value,
      title: this.blogForm.controls['title'].value,
      postType: 'BLOGS',
      blogContent: this.blogForm.controls['blogContent'].value,
      thumbnail: this.fileContent,
      primaryTag: this.blogForm.controls['tags'].value
        ? (this.blogForm.controls['tags'].value as Array<any>)[0]?.id
        : null,
      tags: this.blogForm.controls['secondaryTag'].value
        ? (this.blogForm.controls['secondaryTag'].value as Array<any>).map(
            (val: any) => val.id
          )
        : [],
    };
    const user = JSON.parse(AuthUtils.getUserDetails() || '');
    const role = user.userDetailResponseDTO.role;

    const dailogMessage =
      role === 'Student' || role === 'Corporate' || role === 'Faculty'
        ? 'Nice Work! Take a deep breath! Your blog will be listed once approved'
        : 'Good work! The content will be visible on the portal now';

    if (this.blogForm.valid) {
      this.videoService.addBlog(payload).subscribe({
        next: (res: any) => {
          this.isSubmitted = false;
          this.commonService.dialog({
            type: 'newSuccessModal',
            message1: dailogMessage,
            message2: '',
            btnName: 'OK',
            header: 'Submitted',
          });
          // Notify listeners that a Blog has been added
          this.videoService.notifyPostingAdded('BLOGS');
          this.fileContent = null;
          this.activeModal.close(true);
        },
        error: (err: any) => {
          this.commonService.dialog({
            type: 'newErrorModal',
            message1: 'Failed to publish Blog, please try again',
            message2: '',
            btnName: 'OK',
            header: 'Error',
          });
        },
      });
    }
  }

  public async upload(file: any) {
    const selectedFile = (file && (file.target as HTMLInputElement)).files[0];
    this.blogForm
      .get('thumbnail')
      ?.setValidators([
        fileType(selectedFile),
        fileSizeValidator(selectedFile, File_Size_1),
      ]);
    this.blogForm.get('thumbnail')?.updateValueAndValidity();
    this.thubnilName = selectedFile.name;

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

  toggleThumbnailTooltip() {
    this.activeThumbnailTooltip = !this.activeThumbnailTooltip;
  }

  private uploadImage(file: File): Observable<HttpEvent<any>> {
    const MAX_DIMENSION = 800; // px – max width or height
    return new Observable<HttpEvent<any>>((observer) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (e: any) => {
        const img = new Image();
        img.src = e.target.result as string;

        img.onload = () => {
          let { width, height } = img;
          if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
            const ratio = Math.min(
              MAX_DIMENSION / width,
              MAX_DIMENSION / height
            );
            width = width * ratio;
            height = height * ratio;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
            observer.next(
              new HttpResponse({ body: { imageUrl: resizedDataUrl } })
            );
            observer.complete();
          } else {
            observer.error('Canvas context is null');
          }
        };

        img.onerror = (error) => observer.error(error);
      };

      reader.onerror = (error) => observer.error(error);
    });
  }

  private attachResizeHandle(img: HTMLImageElement): void {
    this.removeResizeHandle();
    this.currentImage = img;

    // ensure image is block-level to show handle nicely
    this.renderer.setStyle(img, 'display', 'inline-block');
    const parentEl = img.parentNode as HTMLElement;
    if (parentEl) {
      this.renderer.setStyle(parentEl, 'position', 'relative');
    }

    // create handle element
    const handle = this.renderer.createElement('span');
    this.renderer.setStyle(handle, 'width', '10px');
    this.renderer.setStyle(handle, 'height', '10px');
    this.renderer.setStyle(handle, 'background', '#1cb5eb');
    this.renderer.setStyle(handle, 'position', 'absolute');
    this.renderer.setStyle(handle, 'right', '0');
    this.renderer.setStyle(handle, 'bottom', '0');
    this.renderer.setStyle(handle, 'cursor', 'se-resize');
    this.renderer.setStyle(handle, 'user-select', 'none');

    this.renderer.appendChild(img.parentNode || img, handle);
    this.currentHandle = handle;

    let startX = 0,
      startY = 0,
      startWidth = 0,
      startHeight = 0;

    const mouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      const newWidth = Math.max(50, startWidth + dx);
      const newHeight = Math.max(50, startHeight + dy);
      this.renderer.setStyle(img, 'width', `${newWidth}px`);
      this.renderer.setStyle(img, 'height', `${newHeight}px`);
    };

    const mouseUp = () => {
      document.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('mouseup', mouseUp);
    };

    this.renderer.listen(handle, 'mousedown', (downEvent: MouseEvent) => {
      downEvent.preventDefault();
      startX = downEvent.clientX;
      startY = downEvent.clientY;
      startWidth = img.clientWidth;
      startHeight = img.clientHeight;

      document.addEventListener('mousemove', mouseMove);
      document.addEventListener('mouseup', mouseUp);
    });
  }

  private removeResizeHandle(): void {
    if (this.currentHandle) {
      this.renderer.removeChild(this.currentHandle.parentNode, this.currentHandle);
      this.currentHandle = null;
    }
    this.currentImage = null;
  }

  ngOnDestroy(): void {
    if (this.keepAliveSub) {
      this.keepAliveSub.unsubscribe();
    }
  }
}
