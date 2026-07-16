import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, Subject } from 'rxjs';
import { HttpService } from '../shared/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class CareerService {
  private careerAddedSource = new Subject<string>();
  /**
   * Emits one of: 'INTERNSHIP', 'PROJECT', 'JOB', 'CERTIFICATION'
   */
  careerAdded$ = this.careerAddedSource.asObservable();

  notifyCareerAdded(type: 'INTERNSHIP' | 'PROJECT' | 'JOB' | 'CERTIFICATION'): void {
    this.careerAddedSource.next(type);
  }

  constructor(private http: HttpClient, private httpService: HttpService) {}

  addInternship(payload: any): Observable<any> {
    return this.httpService.post(`/api/user/addInternship`, payload);
  }

  getInternshipByID(payload: any, page: any): Observable<any> {
    return this.httpService
      .get(
        `/api/user/getInternshipsByTagId?page=${page | 0}&size=10&tagId=${
          payload.id
        }`
      )
      .pipe(
        map((response) => {
          const records = response.data.map((item: any) => {
            item.customDescription = payload.description;
            return item;
          });
          response.data = records;
          response.tagId = payload.id;
          response.pageCount = 0;
          response.isApi = response.data && response.data.length >= 6 ? true:false;
          response.itemIndex = 5;
          return response;
        })
      );
  }

  applyInternship(payload: any): Observable<any> {
    return this.httpService.post(`/api/user/careerApply`, payload);
  }

  addJob(payload: any): Observable<any> {
    return this.httpService.post(`/api/user/addJob`, payload);
  }

  getCareerList(page: any, size: any): Observable<any> {
    return this.httpService.get(
      `/api/user/getCareerList?page=${page}&size=${size}`
    );
  }

  getMyAppliedCareerList(page: any, size: any): Observable<any> {
    return this.httpService.get(
      `/api/user/getMyAppliedCareerList?page=${page}&size=${size}`
    );
  }

  addProject(payload: any): Observable<any> {
    return this.httpService.post(`/api/user/addProject`, payload);
  }

  getListInternships(payload:any): Observable<any>{
    // return this.httpService.get(
    //   `/api/user/listInternships?page=${page}&size=${size}`
    // );
    return this.httpService.post(`/api/user/listInternships`,payload);
  }

  getListJobs(payload:any): Observable<any>{
    // return this.httpService.get(
    //   `/api/user/listJobs?page=${page}&size=${size}`
    // );
    return this.httpService.post(`/api/user/listJobs`,payload);
  }

  getListProjects(payload:any): Observable<any>{
    // return this.httpService.get(
    //   `/api/user/listProjects?page=${page}&size=${size}`
    // );
    return this.httpService.post(`/api/user/listProjects`,payload);
  }

  updateCareerStatus(payload:any): Observable<any>{
    return this.httpService.post(`/api/user/updateCareerStatus`, payload);
  }

  getListCertificationsJobs(payload:any): Observable<any>{
    // return this.httpService.get(
    //   `/api/user/listCertifications?page=${page}&size=${size}`
    // );
    return this.httpService.post(`/api/user/listCertifications`,payload);
  }

  addCertification(payload: any): Observable<any> {
    return this.httpService.post(`/api/user/addCertification`, payload);
  }
  getCareerAppliedList(payload:any): Observable<any> {
    const sizeParam = payload?.size ? payload.size : 10;
    let url: string;
    if (payload?.status && payload.status.length) {
      url = `getCareerAppliedList?documentTypeEnum=${payload.type}&id=${payload.id}&page=${payload.page}&size=${sizeParam}&status=${payload.status}`;
    } else {
      url = `getCareerAppliedList?documentTypeEnum=${payload.type}&id=${payload.id}&page=${payload.page}&size=${sizeParam}`;
    }
    return this.httpService.get(
      `/api/user/${url}`
    ).pipe(
      map((response) => {
        const records = response.data.map((item: any) => {
          const memberCount = item?.members ? item.members.length : 0;
          return {
            ...item,
            ...item?.userDetail,
            fullName: `${item?.userDetail.firstName} ${item?.userDetail.lastName}`,
            view: 'View',
            memberCount
          };
        });
        response.data = records;
        return response;
      })
    );
  }

  careerApprove(payload:any): Observable<any>{
    return this.httpService.post(`/api/user/careerApprove`, payload);
  }

  getResume(id:any): Observable<any>{
    return this.httpService.get(
      `/api/user/getResume?userId=${id}`
    );
  }

  getCareerByID(payload: any, page: any,path:string): Observable<any> {
    return this.httpService
      .get(
        `/api/user/${path}?page=${page | 0}&size=10&tagId=${
          payload.id
        }`
      )
      .pipe(
        map((response) => {
          const records = response.data.map((item: any) => {
            item.customDescription = payload.description;
            return item;
          });
          response.data = records;
          response.tagId = payload.id;
          response.pageCount = 0;
          response.isApi = response.data && response.data.length >= 6 ? true:false;
          response.itemIndex = 5;
          return response;
        })
      );
  }
}
