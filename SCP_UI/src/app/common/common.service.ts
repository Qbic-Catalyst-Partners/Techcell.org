import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../shared/services/http.service';
import { DatePipe } from '@angular/common';
import { ModalComponent } from '../shared/component/modal/modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperModalComponent } from '../shared/component/image-cropper-modal/image-cropper-modal.component';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  allowedKey: any = [8, 9, 32, 37, 38, 39, 30, 46, 40];
  constructor(
    private httpService: HttpService,
    public modalService: NgbModal
  ) {}

  public likePost(data: any): Observable<any> {
    return this.httpService.post('/api/user/likePost', data);
  }

  public addToFavourite(data: any): Observable<any> {
    return this.httpService.post('/api/user/addToFavourite', data);
  }

  // The below function adds base64 format to the image thumbnail
  public convertTOBAse64Format(image: any) {
    return `data:image/jpeg;charset=utf-8;base64,${image}`;
  }

  // Below Function converts binary file to byte array
  fileToByteArray(file: any) {
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

  commonApiPath() {
    return 'http://ec2-35-154-39-126.ap-south-1.compute.amazonaws.com:8081';
  }

  public convertDate(date: any): string {
    return new DatePipe('en-US').transform(date, 'yyyy-MM-dd') || '';
  }

  public listingDate(date: any): string {
    return new DatePipe('en-US').transform(date, 'dd/MM/yyyy') || '';
  }

  dialog(obj: any) {
    const modalRef = this.modalService.open(ModalComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'md',
      centered: true,
    });
    modalRef.componentInstance.modalConfig = obj;
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    // console.log(charCode)
    if (
      (charCode < 48 || (charCode > 57 && charCode < 96) || charCode > 105) &&
      charCode != 8 &&
      charCode != 9 &&
      charCode != 44 &&
      charCode != 45 &&
      charCode != 46 &&
      charCode != 37 &&
      charCode != 38 &&
      charCode != 39 &&
      charCode != 40 &&
      charCode != 144
    ) {
      return false;
    }
    return true;
  }

  alphaOnly(event: any): boolean {
    let key = event.keyCode;
    return (key >= 65 && key <= 90) || this.allowedKey.includes(key);
  }

  tabOnly(event: any) {
    let key = event.keyCode;
    if (key == 9) {
      return true;
    }
    return false;
  }
  public buildSharedLink(route: string): string {
    let link: string = '';
    link = `${window.location.origin}?routeName=${route}`;
    return link;
  }

  getDateDiffInDHM(startDate: any, endDate: any) {
    const diffMs = Math.abs(endDate.getTime() - startDate.getTime());
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes - days * 24 * 60) / 60);
    const minutes = totalMinutes - days * 24 * 60 - hours * 60;
    if (days > 7) {
      return new DatePipe('en-US').transform(startDate, 'd MMM yyyy');
    }
    return (
      (days ? days + ' ' + 'days' + ' ago' : null) ||
      (hours ? hours + ' ' + 'Hours' + ' ago' : null) ||
      (minutes ? minutes + ' ' + 'Min' + ' ago' : null)
    );
  }

  searchingFilterDataPreparation(item: any[]) {
    let res: any = [];
    item.forEach((v: any) => {
      // Special case for author field
      if (v.field === 'author' && v.value) {
        // Create a filter for firstName in postedUser relation
        res.push({
          field: 'firstName',
          child: 'postedUser',
          operator: v.operator,
          value: v.value,
        });
      } else if (v.fieldType == 'input') {
        res.push({ field: v.field, operator: v.operator, value: v.value });
      } else if (v.fieldType == 'date') {
        if (v.value?.from) {
          res.push({
            field: v.field,
            operator: v.operator,
            value: v.value.from,
          });
        }
        if (v.value?.to) {
          res.push({ field: v.field, operator: v.operator, value: v.value.to });
        }
      }
    });
    return res;
  }

  searchingFilterRemoveDuplicate(item: any) {
    const data = [...item];
    let records: any = [];
    if (data && data.length) {
      data.forEach((val: any) => {
        if (
          val.fieldType == 'input' &&
          (val.value || (val.value && val.value.trim().length > 0))
        ) {
          records.push(val);
        } else if (
          val.fieldType == 'date' &&
          Object.values(val.value).filter((v: any) => !!v).length > 0
        ) {
          records.push(val);
        }
      });
    }
    return records;
  }

  public trimText(
    text: string,
    maxLength: number = 15,
    ellipsis: boolean = true
  ): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + (ellipsis ? '...' : '');
  }

  convertHoursToTime(durationInHours: number): string {
    // Calculate the days
    const days = Math.floor(durationInHours / 24);

    // Calculate the remaining hours after extracting days
    const remainingHours = durationInHours % 24;
    const hours = Math.floor(remainingHours);

    // Calculate the minutes from the fractional part of the remaining hours
    // const minutes = Math.floor((remainingHours - hours) * 60);
    // Construct the output string
    // return `${days} Days ${hours} Hours and ${minutes} Minutes`;
    return (
      (days && hours ? `${days} Days ${hours} Hours` : '') ||
      (!days ? `${hours} Hours` : '') ||
      (!hours ? `${days} Days` : '')
    );
  }

  get todayDate() {
    return new Date();
  }

  numberWithDot(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    // console.log(charCode)
    if (
      (charCode < 48 || (charCode > 57 && charCode < 96) || charCode > 105) &&
      charCode != 8 &&
      charCode != 9 &&
      charCode != 44 &&
      charCode != 45 &&
      charCode != 46 &&
      charCode != 37 &&
      charCode != 38 &&
      charCode != 39 &&
      charCode != 40 &&
      charCode != 144 &&
      charCode != 190
    ) {
      return false;
    }
    return true;
  }

  /**
   * Opens the shared image-cropper modal and resolves with the cropped image converted to byte array.
   *
   * @param file        The original File chosen by the user.
   * @param aspectRatio Desired aspect-ratio for cropping (default 1 – square).
   * @param round       Whether to show a round cropper mask (useful for avatars).
   */
  public async openImageCropperAndGetBytes(
    file: File,
    aspectRatio: number = 1,
    round: boolean = false
  ): Promise<number[] | null> {
    const modalRef = this.modalService.open(ImageCropperModalComponent, {
      backdrop: 'static',
      centered: true,
      size: 'lg',
    });

    modalRef.componentInstance.imageFile = file;
    modalRef.componentInstance.aspectRatio = aspectRatio;
    modalRef.componentInstance.round = round;

    try {
      const base64: string | null = await modalRef.result;
      if (!base64) {
        // User cancelled
        return null;
      }
      return this.base64ToByteArray(base64);
    } catch {
      return null;
    }
  }

  /** Converts base64 image data to byte array */
  public base64ToByteArray(base64Data: string): number[] {
    const base64 = base64Data.split(',')[1] || base64Data;
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return Array.from(bytes);
  }
}
