import { ModuleWithProviders, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CareersComponent } from './careers/careers.component';

const routes: Routes = [
  { path: '', redirectTo: 'internships', pathMatch: 'full' },
  {
    path: 'internships',
    component: CareersComponent,
    data: { tab: 'INTERNSHIP' },
  },
  {
    path: 'projects',
    component: CareersComponent,
    data: { tab: 'PROJECT' },
  },
  {
    path: 'jobs',
    component: CareersComponent,
    data: { tab: 'JOB_LISTING' },
  },
  {
    path: 'certifications',
    component: CareersComponent,
    data: { tab: 'CERTIFICATION' },
  },
];

export const careersModuleRoute: ModuleWithProviders<any> =
  RouterModule.forChild(routes);
