import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificationsComponent } from './notifications/notifications.component';
import { MentionsComponent } from './mentions/mentions.component';
import { AllNotificationsComponent } from './all/all.component';

const routes: Routes = [
  {
    path: '',
    component: NotificationsComponent,
    children: [
      { path: '', component: AllNotificationsComponent },
      { path: 'mentions', component: MentionsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationsRoutingModule { } 