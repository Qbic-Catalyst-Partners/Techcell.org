import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { moderatorProfileModuleRoute } from './moderator-profile-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DpDatePickerModule } from 'ng2-date-picker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ModeratorHomeComponent } from './moderator-home/moderator-home.component';
import { ModeratorProfileViewComponent } from './moderator-profile-view/moderator-profile-view.component';



@NgModule({
  declarations: [
    ModeratorHomeComponent,
    ModeratorProfileViewComponent,
  ],
  imports: [
    CommonModule,
    moderatorProfileModuleRoute,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DpDatePickerModule,
    MatDatepickerModule,
    MatFormFieldModule,
  ]
})
export class ModeratorProfileModule { }
