import { Injectable } from '@angular/core';
import { HttpService } from '../../../shared/services/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {

  constructor(private httpService: HttpService) {}

  updateResume(payload:any): Observable<any> {
    return this.httpService.post(`/api/user/updateResume`,payload);
  }

  getResume(): Observable<any> {
    return this.httpService.get(`/api/user/getResume`);
  }
}
