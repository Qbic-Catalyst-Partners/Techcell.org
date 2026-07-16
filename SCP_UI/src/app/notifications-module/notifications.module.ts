import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationsComponent } from './notifications/notifications.component';
import { MentionsComponent } from './mentions/mentions.component';
import { AllNotificationsComponent } from './all/all.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    NotificationsComponent,
    MentionsComponent,
    AllNotificationsComponent
  ],
  imports: [
    CommonModule,
    NotificationsRoutingModule,
    NgbModule,
    MatButtonModule,
    SharedModule
  ]
})
export class NotificationsModule { } 