import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable, filter, from, map } from 'rxjs';
import { AuthUtils } from '../utility/auth-utils';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Notification {
  id: number;
  message: string;
  type: string;
  isRead: boolean;
  createdDate: string;
  postingTitle: string;
  actionUserName: string;
  actionUserProfilePhoto: string;
  postingId: number;
  content?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  result: any;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private httpService: HttpService, private http: HttpClient) {}

  loginAndSetToken(body?: any): Observable<any> {
    return this.httpService.post('/api/public/signIn', body).pipe(
      map((res) => {
        AuthUtils.setAuthToken(res.data.token);
        AuthUtils.setUserDetails(res.data);
        return res.data.userDetailResponseDTO;
      })
    );
  }

  razorpayPayment(payload: any): Observable<any> {
    return this.httpService.post(`/api/public/razorpay/payment`, payload);
  }

  verifyRazorpayPayment(payload: any): Observable<any> {
    return this.httpService.post(`/api/public/razorpay/verify`, payload);
  }

  getListOrgdetailByname(term: string): Observable<any> {
    return this.httpService.get(
      `/api/public/listOrgdetailByname?orgName=${term}`
    );
  }

  getListSecurityQuestions(): Observable<any> {
    return this.httpService.get(`/api/public/listSecurityQuestions`);
  }

  addUser(payload: any): Observable<any> {
    return this.httpService.post(`/api/public/addUser`, payload);
  }

  getSecurityQuestionsByEmail(email: string): Observable<any> {
    return this.httpService.get(
      `/api/public/getSecurityQuestion?emailId=${email}`
    );
  }

  verifySecurityQuestion(payload: any): Observable<any> {
    return this.httpService.post(`/api/public/verifySecurityQuestion`, payload);
  }

  resetPassword(payload: any): Observable<any> {
    return this.httpService.post(`/api/public/resetPassword`, payload);
  }

  verifyOtp(payload: any): Observable<any> {
    return this.httpService.post(`/api/public/verifyOTP`, payload);
  }

  generateSiginOtp(email: any): Observable<any> {
    return this.httpService.post(
      `/api/public/generateSigninOTP?emailId=${email}`,
      {}
    );
  }

  siginInUsingOtp(payload: any): Observable<any> {
    return this.httpService.post(`/api/public/signInUsingOTP`, payload).pipe(
      map((res) => {
        AuthUtils.setAuthToken(res.data.token);
        AuthUtils.setUserDetails(res.data);
        return res.data.userDetailResponseDTO;
      })
    );
  }

  getPostingList(page: number, size: number): Observable<any> {
    return this.httpService.get(
      `/api/user/getPostingList?page=${page}&size=${size}`
    );
  }
  getVideos(page: number, size: number): Observable<any> {
    return this.httpService.get(
      `/api/user/getPostingList?documentTypeEnum=VIDEOS&page=${page}&size=${size}`
    );
  }

  getListProgramName(id: any): Observable<any> {
    return this.httpService.get(`/api/public/listProgramName?orgId=${id}`);
  }

  getListStream(id: any, orgId: any): Observable<any> {
    return this.httpService.get(
      `/api/public/listStream?programId=${id}&orgId=${orgId}`
    );
  }

  likePost(payload: any): Observable<any> {
    return this.httpService.post(`/api/user/likePost`, payload);
  }

  addToFavourite(payload: any): Observable<any> {
    return this.httpService.post(`/api/user/addToFavourite`, payload);
  }

  getMyFavouriteTagList(): Observable<any> {
    return this.httpService.get(`/api/user/getMyFavouriteTagList`);
  }

  getPostingListUsingFavTag(page: number, size: number): Observable<any> {
    return this.httpService.get(
      `/api/user/getPostingListUsingFavTag?page=${page}&size=${size}`
    );
  }

  getPostingUserDetails(id: any): Observable<any> {
    return this.httpService.get(`/api/user/getPosting?postingId=${id}`);
  }

  viewPost(id: any) {
    return this.httpService.put(`/api/user/viewPost/${id}`, {});
  }

  getHomePageCounts() {
    return this.httpService.get(`/api/user/getCounts`);
  }

  get Role() {
    let data: any = AuthUtils.getUserDetails();
    let userData = JSON.parse(data);
    let userInfo = userData?.userDetailResponseDTO;
    return userInfo?.role;
  }

  getContentList(page: number, size: number): Observable<any> {
    return this.httpService.get(
      `/api/user/getMyPostingList?page=${page}&size=${size}`
    );
  }

  getAppliedCarrerList(page: number, size: number): Observable<any> {
    return this.httpService.get(
      `/api/user/getMyAppliedCareerList?page=${page}&size=${size}`
    );
  }

  payPayment(payload: any): Observable<any> {
    return this.httpService.post(`/api/public/payment`, payload);
  }

  getUserCommunityList(page: number, size: number, id: any): Observable<any> {
    return this.httpService.get(
      `/api/user/getUserCommunityList?page=${page}&size=${size}&userId=${id}`
    );
  }

  getLatestPosting(): Observable<any> {
    return this.httpService.get(`/api/public/getLatestPosting`);
  }

  getLandingPageCounts() {
    return this.httpService.get(`/api/public/getCounts`);
  }

  getListingVideoAndBlog(payload: any): Observable<any> {
    // if(sortBy.trim().length){
    //   return this.httpService.get(`/api/user/listPostings?direction=${direction}&documentTypeEnum=${type}&page=${page}&size=10&sortBy=${sortBy}`);
    // }else{
    //   return this.httpService.get(`/api/user/listPostings?documentTypeEnum=${type}&page=${page}&size=10`);
    // }
    return this.httpService.post(`/api/user/listPostings`, payload);
  }

  getUserProfile(userId: number): Observable<any> {
    return this.httpService.get(`/api/user/getUserDetail?userId=${userId}`);
  }

  logOut(): Observable<any> {
    return this.httpService.put(`/api/user/logOut`, {});
  }

  // For email OTP resend
  resendEmailOtp(): Observable<any> {
    return this.httpService.get(
      `/api/user/generateOTP?email=true&sms=false&reason=verification`
    );
  }

  // For SMS OTP resend
  // resendSmsOtp(): Observable<any> {
  //   return this.httpService.post(`/api/user/reSendSMSOTP`, {});
  // }

  // Get payment history
  getPaymentHistory(): Observable<any> {
    return this.httpService.get('/api/user/getPaymentHistory');
  }

  // Download invoice

  downloadInvoice(paymentId: number): Observable<Blob> {
    return this.httpService.get(`/api/user/downloadInvoice/${paymentId}`, {
      responseType: 'blob',
      observe: 'body',
    });
  }

  // Email invoice
  emailInvoice(paymentId: number): Observable<any> {
    return this.httpService.post(`/api/user/emailInvoice/${paymentId}`, {});
  }

  resendSmsOtp(): Observable<any> {
    return this.httpService.get(
      `/api/user/generateOTP?email=false&sms=true&reason=verification`
    );
  }

  getNotifications(): Observable<ApiResponse<Notification[]>> {
    return this.http.get<ApiResponse<Notification[]>>(`${this.apiUrl}/api/user/notifications`);
  }
}
