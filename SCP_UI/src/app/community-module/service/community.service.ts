import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpService } from '../../shared/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  
  private communityAddedSource = new Subject<void>();

  /**
   * Observable listeners can subscribe to in order to get notified whenever a new
   * community is successfully created. Components that need real-time refreshes
   * (e.g. CommunityListingComponent) should subscribe to this.
   */
  communityAdded$ = this.communityAddedSource.asObservable();

  constructor(private http: HttpClient, private httpService: HttpService) {}

  public getAllCommunities(): Observable<any> {
    return this.http.get('https://api.slingacademy.com/v1/sample-data/photos');
  }

  public getCommunityList(page:number,column:string='',direction:string=''): Observable<any> {
    console.log('Service params:', { page, column, direction });
    if(direction.length){
      return this.httpService.get(`/api/user/getCommunityList?orderByField=${!column.length ?'CreatedDate':column}&direction=${direction}&page=${page}&size=10`);
    }else{
      return this.httpService.get(`/api/user/getCommunityList?orderByField=${!column.length ?'CreatedDate':column}&page=${page}&size=10`);
    }
  }

  public addCommunity(payload:any): Observable<any> {
    return this.httpService.post('/api/user/addCommunity',payload)
  }

  /**
   * Call this after a community is added successfully so that subscribers can
   * refresh their data.
   */
  notifyCommunityAdded(): void {
    this.communityAddedSource.next();
  }

  public getModeratorUser(): Observable<any> {
    return this.httpService.get(`/api/user/getUserDetails?role=Moderator`);
  }

  public joinCommunity(id:any): Observable<any> {
    return this.httpService.post(`/api/user/joinCommunity/${id}`,{});
  }

  public exitCommunity(id:any): Observable<any> {
    return this.httpService.delete(`/api/user/exitCommunity/${id}`);
  }

  public getCommunityVideo(page:any,id:any): Observable<any> {
    return this.httpService.get(`/api/user/getPostingListByTagId?documentTypeEnum=VIDEOS&page=${page}&size=0&tagId=${id}`);
  }

  public getCommunityBlog(page:any,id:any): Observable<any> {
    return this.httpService.get(`/api/user/getPostingListByTagId?documentTypeEnum=BLOGS&page=${page}&size=0&tagId=${id}`);
  }

  public getCommunityMembers(id:any): Observable<any> {
    return this.httpService.get(`/api/user/getCommunityMembers?communityId=${id}`);
  }

  public addFeed(payload:any): Observable<any>{
    return this.httpService.post(`/api/user/addFeed`,payload);
  }

  public getFeedList(page:any,id:any): Observable<any> {
    return this.httpService.get(`/api/user/getFeedList?communityId=${id}&page=${page}&size=10`);
  }

  public getMyCommunity(page:any,size:any): Observable<any> {
    return this.httpService.get(`/api/user/getMyCommunityList?page=${page}&size=${size}`);
  }

  public suggestedCommunityList(page:any): Observable<any> {
    return this.httpService.get(`/api/user/getSuggestedCommunityList?page=${page}&size=10`);
  }

  public popularCommunityList(page:any): Observable<any> {
    return this.httpService.get(`/api/user/getCommunityList?orderByField=likes&page=${page}&size=10`);
  }

  public newestCommunityList(page:any): Observable<any> {
    return this.httpService.get(`/api/user/getCommunityList?orderByField=CreatedDate&page=${page}&size=10`);
  }

  public assignModerator(payload:any): Observable<any>{
    return this.httpService.post('/api/user/assignModerator',payload)
  }

  public getOnlyCommunityList(page:number,userId:any=null): Observable<any> {
    if(userId){
      return this.httpService.get(`/api/user/getMyPostingList?documentTypeEnum=COMMUNITY&userId=${userId}&page=${page}&size=10`);
    }else{
      return this.httpService.get(`/api/user/getMyPostingList?documentTypeEnum=COMMUNITY&page=${page}&size=10`);
    }
  }

  getCommunityByTagId(id: any, page: any): Observable<any> {
    return this.httpService
      .get(
        `/api/user/getCommunityListByTagId?documentTypeEnum=COMMUNITY&page=${
          page || 0
        }&size=6&tagId=${id}
    `
      );
  }

}
