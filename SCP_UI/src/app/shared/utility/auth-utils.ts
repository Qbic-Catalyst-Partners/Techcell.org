export class AuthUtils {
  private static authToken = 'Authorization';

  static getAuthToken() {
    return localStorage.getItem(AuthUtils.authToken);
  }
  static setAuthToken(token: any) {
    localStorage.setItem(AuthUtils.authToken, token);
  }
  static removeAuthToken(token: any) {
    localStorage.removeItem(token);
  }

  static clearSessionStorage() {
    localStorage.clear();
  }

  static setUserDetails(res: any) {
    localStorage.setItem('user', JSON.stringify(res));
  }

  static getUserDetails() {
    return localStorage.getItem('user');
  }

  static setBlog(res: any) {
    localStorage.setItem('blog', JSON.stringify(res));
  }

  static getBlog() {
    return localStorage.getItem('blog');
  }

  static clearBlog() {
    localStorage.removeItem('blog');
  }

  static setCommunity(res: any) {
    localStorage.setItem('community', JSON.stringify(res));
  }

  static getCommunity() {
    return localStorage.getItem('community');
  }

  static setProfile(res: any) {
    localStorage.setItem('viewProfile', JSON.stringify(res));
  }

  static getProfile() {
    return localStorage.getItem('viewProfile');
  }

  static setLocalStorageItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static getLocalStorageItem(key: string): any {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  static removeLocalStorageItem(key: string): void {
    localStorage.removeItem(key);
  }
}
