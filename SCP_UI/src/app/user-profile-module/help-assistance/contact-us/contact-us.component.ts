import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  File_Size_1,
  File_Type_Accepted,
  File_Type_Accepted_Extra,
} from '../../../common/constants';
import { fileSizeValidator, fileType } from '../../../common/form-validations';
import { UserprofileService } from '../../service/userprofile.service';
import { CommonService } from '../../../shared/services/common.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
})
export class ContactUsComponent {
  public isSubmitted: boolean = false;
  public imageType: string = File_Type_Accepted_Extra;
  public categoryList: any[] = [
    { name: 'Questions' },
    { name: 'Bug Reports' },
    { name: 'Feedback' },
    { name: 'Requests' },
  ];
  public screenShotName: any;
  public screenShot: any;
  public maxChars: number = 50;
  public descriptionMaxChars: number = 250;
  showFileSize = false;

  constructor(
    private fb: FormBuilder,
    private userprofileService: UserprofileService,
    public commonService: CommonService
  ) {}

  public headerForm = this.fb.group({
    category: ['', Validators.required],
    subject: ['', Validators.required],
    message: ['', Validators.required],
    screenShot: [''],
  });

  get fieldName() {
    return this.headerForm.controls;
  }

  public async upload(file: any, from: any) {
    const selectedFile = (file && (file.target as HTMLInputElement)).files[0];
    this.headerForm
      .get('screenShot')
      ?.setValidators([
        fileType(selectedFile, true),
        fileSizeValidator(selectedFile, File_Size_1),
      ]);
    this.headerForm.get('screenShot')?.updateValueAndValidity();
    this.screenShotName = file.target.files[0].name;
    this.screenShot = await this.fileToByteArray(file.target.files[0]);
  }

  public submitData(): void {
    this.isSubmitted = true;
    let payload = {
      category: this.headerForm.controls['category'].value,
      document: this.screenShot || null,
      message: this.headerForm.controls['message'].value,
      subject: this.headerForm.controls['subject'].value,
    };
    console.log(this.headerForm.value);
    if (this.headerForm.valid) {
      this.userprofileService.contactUs(payload).subscribe({
        next: (res: any) => {
          console.log(res);
          this.commonService.dialog({
            type: 'newSuccessModal',
            message1: 'We Will Contact You Soon,Thanks For the Update',
            btnName: 'OK',
            header: 'Success'
          });
          this.headerForm.reset();
          this.isSubmitted = false;
        },
        error: (error) => {
          console.log(error.message);
          this.commonService.dialog({
            type: 'newErrorModal',
            message1: error.message || 'Something went wrong',
            btnName: 'OK',
            header: 'Error'
          });
        },
      });
    }
  }

  public fileToByteArray(file: any) {
    return new Promise((resolve, reject) => {
      try {
        let reader = new FileReader();
        let fileByteArray: any = [];
        reader.readAsArrayBuffer(file);
        reader.onloadend = (evt: any) => {
          if (evt.target.readyState == FileReader.DONE) {
            let arrayBuffer = evt.target.result,
              array = new Uint8Array(arrayBuffer);
            for (let byte of array) {
              fileByteArray.push(byte);
            }
          }
          resolve(fileByteArray);
        };
      } catch (e) {
        reject(e);
      }
    });
  }

  onMouseEnter() {
    this.showFileSize = true;
  }

  onMouseLeave() {
    this.showFileSize = false;
  }
}
