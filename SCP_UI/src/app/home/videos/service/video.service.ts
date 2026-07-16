import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpService } from '../../../shared/services/http.service';
import { IVideoUpload } from '../models/video.interface';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  constructor(private httpService: HttpService) {}

  /**
   * Emits whenever a new Blog or Video is successfully created.
   * The payload string denotes the post type – e.g. 'BLOGS' or 'VIDEOS'.
   */
  private postingAddedSource = new Subject<string>();
  postingAdded$ = this.postingAddedSource.asObservable();

  notifyPostingAdded(type: 'BLOGS' | 'VIDEOS'): void {
    this.postingAddedSource.next(type);
  }

  uploadVideo(payload: any): Observable<any> {
    return this.httpService.post(`/api/user/addVideo`, payload);
  }

  getHashTagList(tagName: string): Observable<any> {
    return this.httpService.get(`/api/org/getHashTagList?tagName=${tagName}`);
  }

  getAllHashTagList(): Observable<any> {
    return this.httpService.get(`/api/org/getHashTagList?tagName=`);
  }

  getFavouriteList(page: number): Observable<any> {
    return this.httpService.get(
      `/api/user/getMyFavouritePostingList?documentTypeEnum=VIDEOS&page=${
        page || 0
      }&size=${7}`
    );
  }

  getVideosByTagId(tagId: any, page: any): Observable<any> {
    return this.httpService
      .get(`/api/user/getPostingListByTagId?documentTypeEnum=VIDEOS&page=${
      page || 0
    }&size=100&tagId=${tagId}
    `);
  }

  getMyVideos(page: number,userId:any=null): Observable<any> {
    if(userId){
      return this.httpService.get(
        `/api/user/getMyPostingList?documentTypeEnum=VIDEOS&userId=${userId}&page=${
          page || 0
        }&size=${7}`
      );
    }else{
      return this.httpService.get(
        `/api/user/getMyPostingList?documentTypeEnum=VIDEOS&page=${
          page || 0
        }&size=${7}`
      );
    }
  }

  getMyAccess(): Observable<any> {
    return this.httpService.get(`/api/user/getMyAccess`);
  }

  addBlog(payload:any): Observable<any>{
    return this.httpService.post(`/api/user/addBlog`, payload);
  }

  getMyBlogs(page: number,size:number): Observable<any>{
    return this.httpService.get(
      `/api/user/getPostingList?documentTypeEnum=BLOGS&page=${
        page || 0
      }&size=${size}`
    );
  }

  addComment(payload:any): Observable<any>{
    return this.httpService.post(`/api/user/addComment`, payload);
  }

  getComment(payload:any): Observable<any>{
    return this.httpService.get(`/api/user/getComments?postingId=${payload.postingId}&page=${payload.page}&size=${payload.size}`);
  }

  updateComment(payload:any,commentId:any): Observable<any>{
    return this.httpService.put(`/api/user/updateComment/${commentId}`, payload);
  }

  deleteComment(id:any): Observable<any>{
    return this.httpService.delete(`/api/user/deleteComment/${id}`);
  }

  getUserDetails(id:any): Observable<any>{
    return this.httpService.get(`/api/user/getUserDetail?userId=${id}`);
  }

  updatePostingStatus(payload:any): Observable<any>{
    return this.httpService.post(`/api/user/updatePostingStatus`, payload);
  }

  getReplayComment(payload:any): Observable<any>{
    return this.httpService.get(`/api/user/getReplyComments?page=${payload.page}&parentCommentId=${payload.pId}&size=${payload.size}`);
  }

  /** Suggest users by full name (for @ mention) */
  searchUsersByName(term: string): Observable<any> {
    return this.httpService.get(`/api/user/searchUsersByName?query=${encodeURIComponent(term)}`);
  }

}
