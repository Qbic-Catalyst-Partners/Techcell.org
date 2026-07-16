import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthUtils } from '../utility/auth-utils';
import SockJS from 'sockjs-client';
import { environment } from '../../../environments/environment';

interface UserProfile {
  userDetailResponseDTO: {
    userId: number;
    firstName: string;
    lastName: string;
    emailId: string;
    mobileNo: string;
    role: string;
    gender: string;
    dob: string;
    effectiveDate: string;
    graduationCompletiondate: string | null;
    studentId: string | null;
    facultyId: string | null;
    programName: string | null;
    courseLevel: string;
    stream: string | null;
    orgId: number | null;
    status: string;
    profilePhoto: string;
    securityQuestion: {
      questionId: number;
      questiondesc: string;
    };
    securityAns: string;
    otpVerified: boolean;
    designation: string;
    qualification: string;
    domailExp: string;
    currentCompany: string;
    workExp: string;
    linkedinProfile: string;
    city: string;
    state: string;
    description: string | null;
    orgName: string | null;
    orgAICTECode: string | null;
    paymentReceived: boolean;
    welcomeScreenShow: boolean;
  };
  token: string;
  refreshToken: string;
  orgName: string | null;
  lastSignInDate: string;
}

interface Notification {
  id: number;
  eventType: string;
  entityType: string;
  entityId: number;
  message: string;
  isRead: boolean;
  createdDate: string;
  extraJson?: string;
}

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private stompClient!: Client;
  private notificationSubject = new BehaviorSubject<Notification | null>(null);
  public notifications$ = this.notificationSubject.asObservable();
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor() {
    // Attempt connection right away (covers hard Refresh / already-logged-in users)
    this.initializeWebSocketConnection();

    // Listen for storage changes – e.g., after fresh login in same tab
    window.addEventListener('storage', (ev) => {
      if (ev.key === 'user' && ev.newValue && !this.isConnected) {
        this.initializeWebSocketConnection();
      }
      if (ev.key === 'Authorization' && ev.newValue && !this.isConnected) {
        this.initializeWebSocketConnection();
      }
    });
  }

  public initializeWebSocketConnection() {
    if (this.isConnected) {
      return;
    }
    const profile = localStorage.getItem('user');
    if (!profile) {
      return;
    }

    try {
      const user = JSON.parse(profile) as UserProfile;

      const token = AuthUtils.getAuthToken();
      if (!token) {
        return;
      }

      // Check if we have a valid user ID
      if (!user.userDetailResponseDTO?.userId) {
        return;
      }

      this.stompClient = new Client({
        webSocketFactory: () => {
          // const baseUrl = 'http://192.168.0.126:8081';
          // const baseUrl = 'http://20.244.14.20:8081';
          const baseUrl = 'http://localhost:8081';
          // const baseUrl = 'https://www.techcell.org:8081';
          return new SockJS(`${baseUrl}/ws`);
        },
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        debug: function (str) {
          if (!str.includes('server undefined')) {
          }
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      this.stompClient.onConnect = (frame) => {
        this.isConnected = true;
        this.reconnectAttempts = 0;

        const topic = `/topic/notifications/${user.userDetailResponseDTO.userId}`;

        this.stompClient.subscribe(topic, (message) => {
          try {
            const notification = JSON.parse(message.body) as Notification;

            this.notificationSubject.next(notification);
          } catch (error) {}
        });
      };

      this.stompClient.onStompError = (frame) => {
        this.handleConnectionError();
      };

      this.stompClient.onWebSocketError = (event) => {
        this.handleConnectionError();
      };

      this.stompClient.onWebSocketClose = (event) => {
        this.isConnected = false;
        this.handleConnectionError();
      };

      this.stompClient.activate();
    } catch (error) {}
  }

  private handleConnectionError() {
    this.isConnected = false;
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;

      setTimeout(() => this.initializeWebSocketConnection(), 5000);
    } else {
    }
  }

  public disconnect() {
    if (this.stompClient && this.isConnected) {
      this.stompClient.deactivate();
      this.isConnected = false;
    }
  }
}
