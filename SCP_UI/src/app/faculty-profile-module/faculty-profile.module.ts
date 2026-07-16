import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { facultyProfileModuleRoute } from './faculty-profile-routing.module';
import { FacultyHomeComponent } from './faculty-home/faculty-home.component';
import { FacultyProfileViewComponent } from './faculty-profile-view/faculty-profile-view.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DpDatePickerModule } from 'ng2-date-picker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';



@NgModule({
  declarations: [
    FacultyHomeComponent,
    FacultyProfileViewComponent
  ],
  imports: [
    CommonModule,
    facultyProfileModuleRoute,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DpDatePickerModule,
    MatDatepickerModule,
    MatFormFieldModule,
  ]
})
export class FacultyProfileModule { }
