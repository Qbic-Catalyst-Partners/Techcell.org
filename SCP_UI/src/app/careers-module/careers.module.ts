import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DpDatePickerModule } from 'ng2-date-picker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { careersModuleRoute } from './carreers-routing.module';
import { CareersComponent } from './careers/careers.component';
import { InternshipsComponent } from './internships/internships.component';
import { ProjectsComponent } from './projects/projects.component';
import { JobListingsComponent } from './job-listings/job-listings.component';
import { CarouselModule } from 'ngx-owl-carousel-o'; 
import { AddInternshipModalComponent } from './careers/modals/add-internship-modal/add-internship-modal.component';
import { AddProjectModalComponent } from './careers/modals/add-project-modal/add-project-modal.component';
import { AddJobListingModalComponent } from './careers/modals/add-job-listing-modal/add-job-listing-modal.component';
import { InternshipModalComponent } from './internships/modals/internship-modal.component';
import { JoblistingModalComponent } from './job-listings/joblisting-modal/joblisting-modal.component';
import { ProjectModalComponent } from './projects/project-modal/project-modal.component';
import { InternshipListComponent } from './internship-list/internship-list.component';
import { JobListComponent } from './job-list/job-list.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { CertificationGridViewComponent } from './certification-grid-view/certification-grid-view.component';
import { CertificationListViewComponent } from './certification-list-view/certification-list-view.component';
import { AddCertificationModalComponent } from './careers/modals/add-certification-modal/add-certification-modal.component';
import { CertificationListingModalComponent } from './certification-grid-view/certification-listing-modal/certification-listing-modal.component';
import { InternshipRecivedComponent } from './modals/internship-recived/internship-recived.component';
import { ProjectRecivedComponent } from './modals/project-recived/project-recived.component';
import { JoblistingRecivedComponent } from './modals/joblisting-recived/joblisting-recived.component';
import { CertificatRecivedComponent } from './modals/certificat-recived/certificat-recived.component';


@NgModule({
  declarations: [
    CareersComponent,
    InternshipsComponent,
    ProjectsComponent,
    JobListingsComponent, 
    AddInternshipModalComponent,
    AddProjectModalComponent,
    AddJobListingModalComponent,
    InternshipModalComponent,
    JoblistingModalComponent,
    ProjectModalComponent,
    InternshipListComponent,
    JobListComponent,
    ProjectListComponent,
    CertificationGridViewComponent,
    CertificationListViewComponent,
    AddCertificationModalComponent,
    CertificationListingModalComponent,
    InternshipRecivedComponent,
    ProjectRecivedComponent,
    JoblistingRecivedComponent,
    CertificatRecivedComponent
  ],
  imports: [
    CommonModule,
    careersModuleRoute,
    SharedModule,
    CarouselModule,
    FormsModule,
    ReactiveFormsModule,
    DpDatePickerModule,
    MatDatepickerModule,
    MatFormFieldModule,
  ]
})
export class CareersModule { }
