import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../component/modal/modal.component';
import { DatePipe } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { TncComponent } from '../component/tnc/tnc.component';
import { PrivacyPolicyComponent } from '../component/privacy-policy/privacy-policy.component';
import { CookiePolicyComponent } from '../component/cookie-policy/cookie-policy.component';
import { RefundPolicyComponent } from '../component/refund-policy/refund-policy.component';
import { HttpService } from './http.service';
import { ImageCropperModalComponent } from '../component/image-cropper-modal/image-cropper-modal.component';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private myBehaviorSubject = new BehaviorSubject<boolean>(false);
  private notifCountSubject = new BehaviorSubject<number>(0);
  allowedKey: any = [8, 9, 32, 37, 38, 39, 30, 46];
  constructor(public modalService: NgbModal, private httpService: HttpService) {}

  /**
   * Opens a standard modal dialog.
   *
   * Usage patterns supported:
   *   1. Positional arguments – legacy signature
   *      dialog('newSuccessModal', 'Saved successfully', '', 'OK', 'Success');
   *   2. Single configuration object – newer/cleaner syntax
   *      dialog({
   *        type: 'newSuccessModal',
   *        message1: 'Saved successfully',
   *        btnName: 'OK',
   *        header: 'Success'
   *      });
   */
  dialog(
    typeOrConfig: string | {
      type: string;
      message1?: string;
      message2?: string;
      btnName?: string;
      header?: string;
      session?: boolean;
    },
    msg1: string = '',
    msg2: string = '',
    btnName: string = '',
    header: string = '',
    session: boolean = false
  ) {
    // Normalize inputs to a single config object
    const cfg = typeof typeOrConfig === 'string'
      ? {
          type: typeOrConfig,
          message1: msg1,
          message2: msg2,
          btnName: btnName,
          header: header,
          session: session,
        }
      : {
          type: typeOrConfig.type,
          message1: typeOrConfig.message1 || '',
          message2: typeOrConfig.message2 || '',
          btnName: typeOrConfig.btnName || '',
          header: typeOrConfig.header || '',
          session: typeOrConfig.session || false,
        };

    // Close any existing modals first
    this.modalService.dismissAll();
    
    const modalRef = this.modalService.open(ModalComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'md',
      centered: true,
      windowClass: 'modal-top',
      animation: true
    });
    
    // Ensure the modal is on top
    const modalElement = document.querySelector('.modal');
    if (modalElement) {
      modalElement.setAttribute('style', 'z-index: 2000 !important');
    }
    
    modalRef.componentInstance.modalConfig = {
      type: cfg.type,
      message1: cfg.message1,
      message2: cfg.message2,
      btnName: cfg.btnName,
      header: cfg.header,
      session: cfg.session,
    };
  }

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

  setValue(value: boolean) {
    this.myBehaviorSubject.next(value);
  }

  getValue() {
    return this.myBehaviorSubject.asObservable();
  }

  unSetSubject() {
    return this.myBehaviorSubject.unsubscribe();
  }

  public convertDate(date: any): string {
    return new DatePipe('en-US').transform(date, 'yyyy-MM-dd') || '';
  }

  public listingDate(date: any): string {
    return new DatePipe('en-US').transform(date, 'dd/MM/yyyy') || '';
  }

  public convertTOBAse64Format(image: any) {
    return `data:image/jpeg;charset=utf-8;base64,${image}`;
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    console.log(charCode);
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

  specialCharNotAllow(event: any): boolean {
    let key = event.keyCode;
    if (event.shiftKey) {
      event.preventDefault();
    }
    return (
      (key >= 48 && key <= 90 && key != 16) || this.allowedKey.includes(key)
    );
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

  public openPrivacyPolicyWindow(): void {
    const modalRef = this.modalService.open(PrivacyPolicyComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'lg',
      centered: true,
    });
    const data: any = {};
    modalRef.componentInstance.viewData = data;
  }

  public openTermsAndConditionsWindow(): void {
    const modalRef = this.modalService.open(TncComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'lg',
      centered: true,
    });
    const data: any = {};
    modalRef.componentInstance.viewData = data;
  }

  public cookieModal(): void {
    const modalRef = this.modalService.open(CookiePolicyComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'lg',
      centered: true,
    });
    const data: any = {};
    modalRef.componentInstance.viewData = data;
  }

  public refundModal(): void {
    const modalRef = this.modalService.open(RefundPolicyComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'lg',
      centered: true,
    });
    const data: any = {};
    modalRef.componentInstance.viewData = data;
  }

  searchingFilterDataPreparation(item: any[]) {
    let res: any = [];
    item.forEach((v: any) => {
      if (v.fieldType == 'input') {
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

  public getNotifications(): Observable<any> {
    return this.httpService.get('/api/user/notifications');
  }

  // Notification count helpers
  setNotificationCount(count: number) {
    this.notifCountSubject.next(count);
  }

  incNotificationCount(delta: number = 1) {
    this.notifCountSubject.next(this.notifCountSubject.value + delta);
  }

  decNotificationCount(delta: number = 1) {
    const next = this.notifCountSubject.value - delta;
    this.notifCountSubject.next(next < 0 ? 0 : next);
  }

  getNotificationCount(): Observable<number> {
    return this.notifCountSubject.asObservable();
  }

  /**
   * Opens the shared image-cropper modal and resolves with the cropped image converted to byte array.
   *
   * @param file   The original File chosen by the user.
   * @param aspectRatio  Desired aspect-ratio for cropping (default 1 – square).
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
        // User hit cancel – indicate no change
        return null;
      }
      return this.base64ToByteArray(base64);
    } catch (err) {
      // Modal dismissed (cancel)
      return null;
    }
  }

  /** Converts a base64 image string (data:image/..;base64,AAA..) to a byte array */
  public base64ToByteArray(base64Data: string): number[] {
    // Remove header if present
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
