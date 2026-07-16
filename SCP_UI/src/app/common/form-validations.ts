import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { File_Type_Accepted, File_Type_Accepted_Extra } from './constants';

export const confirmPasswordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  return control.value.password === control.value.confirmPassword
    ? null
    : { PasswordNotMatched: true };
};

export function fileSizeValidator(file:any,maxSize: number): any {
  const validator: ValidatorFn = (control: AbstractControl):any=>{
    const selectedFile = file;
    if (selectedFile && selectedFile.size > maxSize) {
      return { 'fileSize': { error: true } };
    }

    return null;
  }
  return validator;
}

export function fileType(file:any,extra:boolean=false): any {
  const validator: ValidatorFn = (control: AbstractControl):any=>{
    const selectedFile = extra ?File_Type_Accepted_Extra:File_Type_Accepted;
    const extension = file.name.split('.')[1];
    if (selectedFile && !selectedFile.includes(extension)) {
      return { 'fileType': { error: true } };
    }

    return null;
  }
  return validator;
}

export function ValidateUrl(control: AbstractControl) {
  if (control.value.startsWith('https://www.youtube.com') || control.value.startsWith('https://youtu.be/')) {
  return null;
  }
  return { validUrl: true };
}

export function noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { required: true } : null;
  };
}

// Ensures the selected date is today or in the future
export function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const inputDate = new Date(control.value);
    const today = new Date();
    // normalise time
    today.setHours(0,0,0,0);
    inputDate.setHours(0,0,0,0);
    return inputDate >= today ? null : { pastDate: true };
  };
}



