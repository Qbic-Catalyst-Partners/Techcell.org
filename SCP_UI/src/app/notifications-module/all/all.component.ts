import { Component, Host, Optional, SkipSelf } from '@angular/core';
import { NotificationsComponent } from '../notifications/notifications.component';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-all-notifications',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.scss']
})
export class AllNotificationsComponent {
  constructor(@Optional() @SkipSelf() public parent: NotificationsComponent) {}

  get allNotifications() {
    return (this.parent?.notifications || []).filter(n => n.eventType !== 'MENTION');
  }

  // Reuse parent methods if needed
  markAsRead(n: any, tooltip?: NgbTooltip) {
    this.parent.markAsRead(n, tooltip);
  }
  markAsUnread(n: any, tooltip?: NgbTooltip) {
    this.parent.markAsUnread(n, tooltip);
  }
  clear(n: any, tooltip?: NgbTooltip) {
    this.parent.clear(n, tooltip);
  }
  acceptInvite(n: any) { this.parent.acceptInvite(n); }
  rejectInvite(n: any) { this.parent.rejectInvite(n); }
  onCardClick(e: MouseEvent, n: any) { this.parent.onCardClick(e,n); }
  onMessageClick(e: MouseEvent, n: any) { this.parent.onMessageClick(e,n); }
  viewProfile(n: any) { this.parent.viewProfile(n); }
  toggleTooltip(t: NgbTooltip) { this.parent.toggleTooltip(t); }
  relativeTimePipe(val: any) { return val; }
} 