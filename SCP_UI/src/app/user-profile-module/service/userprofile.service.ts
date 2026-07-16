import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/services/http.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserprofileService {
  private submenuData = new BehaviorSubject<string>('');

  constructor(private httpService: HttpService) {}

  getUserDetail(): Observable<any> {
    return this.httpService.get(`/api/user/getUserDetail`);
  }

  updateUser(payload: any): Observable<any> {
    return this.httpService.put('/api/user/updateUser', payload);
  }

  /** Update only profile photo */
  updateProfilePhoto(payload: any): Observable<any> {
    return this.httpService.put('/api/user/updateProfilePhoto', payload);
  }

  generateOtp(): Observable<any> {
    return this.httpService.get(
      `/api/user/generateOTP?email=true&sms=true&reason=updateEmailAndMobile`
    );
  }

  deleteFavTagList(ids: any): Observable<any> {
    return this.httpService.delete(`/api/user/deleteFavouriteTagList?${ids}`);
  }

  addFavTagList(ids: any): Observable<any> {
    return this.httpService.post(`/api/user/addFavouriteTag?${ids}`, {});
  }

  setSubMenuData(value: string) {
    this.submenuData.next(value);
  }

  getSubMenuData() {
    return this.submenuData.asObservable();
  }

  getPendingApproved(page: number, tagList: any): Observable<any> {
    if (tagList) {
      return this.httpService.get(
        `/api/user/getPostingListUsingFavTag?hashTagList=${tagList}&page=${page}&size=10&status=Pending Approved`
      );
    } else {
      return this.httpService.get(
        `/api/user/getPostingListUsingFavTag?page=${page}&size=10&status=Pending Approved`
      );
    }
  }

  getMyCommunityTagList(): Observable<any> {
    return this.httpService.get(`/api/user/getMyCommunityTagList`);
  }

  approveRejectPost(payload: any): Observable<any> {
    return this.httpService.post(`/api/user/approvePost`, payload);
  }

  contactUs(payload: any): Observable<any> {
    return this.httpService.post(`/api/user/contactUs`, payload);
  }

  userDetailsList(payload: any): Observable<any> {
    // return this.httpService.get(`/api/user/listUserDetails?page=${page}&size=10`);
    return this.httpService.post(`/api/user/listUserDetails`, payload);
  }

  updateUserStatus(payload: any): Observable<any> {
    return this.httpService.put(`/api/user/updateUser`, payload);
  }

  updateWelcomeScreen(): Observable<any> {
    return this.httpService.put('/api/user/updateWelcomeScreen', {});
  }
}
