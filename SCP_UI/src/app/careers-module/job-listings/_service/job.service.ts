import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../../../shared/services/http.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  constructor(private http: HttpClient, private httpService: HttpService) {}

  addInternship(payload: any): Observable<any> {
    return this.httpService.post(`/api/user/addInternship`, payload);
  }

  getJobsByTagIdByID(payload: any, page: any): Observable<any> {
    return this.httpService.get(
      `/api/user/getJobsByTagId?page=${page | 0}&size=10&tagId=${payload.id}`
    ).pipe(
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
    );;
  }

  applyJob(payload: any): Observable<any> {
    return this.httpService.post(`/api/user/careerApply`, payload);
  }

  addJob(payload: any): Observable<any> {
    return this.httpService.post(`/api/user/addJob`, payload);
  }

  getProjectByTagIdByID(payload: any, page: any): Observable<any> {
    return this.httpService.get(
      `/api/user/getProjectByTagId?page=${page | 0}&size=10&tagId=${payload.id}`
    ) .pipe(
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
    );;
  }

  getCertificationByTagIdByID(payload: any, page: any): Observable<any> {
    return this.httpService.get(
      `/api/user/getCertificationByTagId?page=${page | 0}&size=10&tagId=${payload.id}`
    ) .pipe(
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
    );;
  }
}
