import { Injectable } from '@angular/core';
import { HttpService } from '../../../shared/services/http.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SoftwareService {
  constructor(private httpService: HttpService) {}

  /**
   * Emits whenever a new software record is successfully created so list views can refresh.
   */
  private softwareAddedSource = new Subject<void>();
  softwareAdded$ = this.softwareAddedSource.asObservable();

  notifySoftwareAdded(): void {
    this.softwareAddedSource.next();
  }

  public getAllSoftwares(payload:any): Observable<any> {
    // return this.httpService.get(`/api/user/getSoftware?page=${page}&size=${size}`);
    return this.httpService.post(`/api/user/listSoftware`, payload);
  }
  
  addSoftware(payload:any): Observable<any>{
    return this.httpService.post(`/api/user/addSoftware`, payload);
  }

  getSoftwareByTagId(page:number,tagId:number): Observable<any> {
    return this.httpService.get(`/api/user/getSoftwareByTagId?page=${page}&size=10&tagId=${tagId}`);
  }

  updateSoftwareStatus(payload:any): Observable<any>{
    return this.httpService.post(`/api/user/updateSoftwareStatus`, payload);
  }
}
