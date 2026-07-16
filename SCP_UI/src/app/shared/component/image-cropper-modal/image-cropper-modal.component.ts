import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-cropper-modal',
  templateUrl: './image-cropper-modal.component.html',
  styleUrls: ['./image-cropper-modal.component.scss'],
})
export class ImageCropperModalComponent {
  /** Raw File object received from caller */
  @Input() imageFile!: File;
  /** Cropper aspect ratio. Provide 1 for square, etc. */
  @Input() aspectRatio: number = 1;
  /** Display cropper as round */
  @Input() round: boolean = false;

  /** Used by <image-cropper> input */
  imageChangedEvent: any;
  /** Base64 string after crop */
  croppedBase64: string = '';
  transform: ImageTransform = {};
  scale: number = 1;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    // Prepare a fake change event that ngx-image-cropper expects, reusing the provided File object.
    this.imageChangedEvent = {
      target: {
        files: [this.imageFile],
      },
    };
  }

  /** Fired on every crop */
  imageCropped(event: ImageCroppedEvent) {
    this.croppedBase64 = event.base64 ?? '';
  }

  /** Close modal without saving */
  cancel() {
    this.activeModal.dismiss();
  }

  /** Save cropped image */
  save() {
    this.activeModal.close(this.croppedBase64);
  }

  zoom(delta: number) {
    const current = this.transform.scale || 1;
    const next = Math.min(3, Math.max(0.3, +(current + delta).toFixed(2)));
    this.transform = { ...this.transform, scale: next };
    this.scale = next;
  }

  onSliderChange(val: string) {
    const num = parseFloat(val);
    this.scale = num;
    this.transform = { ...this.transform, scale: num };
  }
} 