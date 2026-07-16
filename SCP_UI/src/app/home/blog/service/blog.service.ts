import { Injectable } from '@angular/core';
import { HttpService } from '../../../shared/services/http.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  constructor(private httpService: HttpService) {}

  getAllHashTagList(): Observable<any> {
    return this.httpService.get(`/api/org/getHashTagList?tagName=`);
  }

  getMyFavouriteBlogs(page: number, size: number): Observable<any> {
    return this.httpService.get(
      `/api/user/getMyFavouritePostingList?documentTypeEnum=BLOGS&page=${
        page || 0
      }&size=${size}`
    );
  }

  getMyBlogs(page: number, size: number): Observable<any> {
    return this.httpService.get(
      `/api/user/getPostingList?documentTypeEnum=BLOGS&page=${
        page || 0
      }&size=${size}`
    );
  }

  getBlogsByTagId(payload: any, page: any): Observable<any> {
    return this.httpService
      .get(
        `/api/user/getPostingListByTagId?documentTypeEnum=${payload.documentTypeEnum}&page=${
          page || 0
        }&size=100&tagId=${payload.id}
    `
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
          response.isApi = response.data && response.data.length >= 100 ? true:false;
          response.itemIndex = 5;
          response.text = payload.text;
          return response;
        })
      );
  }

  getOnlyBlogs(page: number, size: number,userId:any=null): Observable<any> {
    if(userId){
      return this.httpService.get(
        `/api/user/getMyPostingList?documentTypeEnum=BLOGS&userId=${userId}&page=${
          page || 0
        }&size=${size}`
      );
    }else{
      return this.httpService.get(
        `/api/user/getMyPostingList?documentTypeEnum=BLOGS&page=${
          page || 0
        }&size=${size}`
      );
    }
  }
}
