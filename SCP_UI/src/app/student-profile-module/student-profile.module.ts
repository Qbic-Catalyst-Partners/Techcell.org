import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { studentProfileModuleRoute } from './student-profile-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DpDatePickerModule } from 'ng2-date-picker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StudentHomeComponent } from './student-home/student-home.component';
import { StudentProfileViewComponent } from './student-profile-view/student-profile-view.component';



@NgModule({
  declarations: [
    StudentHomeComponent,
    StudentProfileViewComponent
  ],
  imports: [
    CommonModule,
    studentProfileModuleRoute,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DpDatePickerModule,
    MatDatepickerModule,
    MatFormFieldModule,
  ]
})
export class StudentProfileModule { }
