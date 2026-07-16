import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { UserModeratorRegistrationComponent } from './user-moderate-registration/user-moderate-registration';
import { UserCorporateRegistrationComponent } from './user-corporate-registration/user-corporate-registration';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: UserRegistrationComponent,
  },
  {
    path: 'moderator',
    component: UserModeratorRegistrationComponent,
  },
  {
    path: 'corporator',
    component: UserCorporateRegistrationComponent,
  }
];

export const UserModuleRoute: ModuleWithProviders<any> = RouterModule.forChild(routes);
