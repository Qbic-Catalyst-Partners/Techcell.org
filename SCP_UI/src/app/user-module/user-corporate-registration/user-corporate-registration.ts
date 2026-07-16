import { Component } from '@angular/core';

@Component({
  selector: 'app-user-corporate-registration',
  templateUrl: './user-corporate-registration.html',
  styleUrls: ['./user-corporate-registration.scss'],
})
export class UserCorporateRegistrationComponent {
  public userRoles = ['Corporate'];
  public activeUser: string = 'Corporate';

  constructor() {}
  // No additional logic needed – acts as simple container
}
