import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthUtils } from '../../utility/auth-utils';
import { UserprofileService } from '../../../user-profile-module/service/userprofile.service';

@Component({
  selector: 'app-welcome-modal',
  templateUrl: './welcome-modal.component.html',
  styleUrl: './welcome-modal.component.scss',
})
export class WelcomeModalComponent implements OnInit {
  userInfo: { firstName: string; lastName: string } | null = null;

  constructor(
    public activeModal: NgbActiveModal,
    private userprofileService: UserprofileService
  ) {}

  ngOnInit(): void {
    // Get user info from local storage for the welcome message
    const userData = AuthUtils.getUserDetails();
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        this.userInfo = {
          firstName: parsedUserData.userDetailResponseDTO.firstName,
          lastName: parsedUserData.userDetailResponseDTO.lastName,
        };
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }

  close() {
    this.userprofileService.updateWelcomeScreen().subscribe({
      next: () => {
        // Update local storage to reflect the change
        const userDataStr = AuthUtils.getUserDetails();

        if (userDataStr) {
          try {
            const userData = JSON.parse(userDataStr);
            userData.userDetailResponseDTO.welcomeScreenShow = true;
            AuthUtils.setUserDetails(userData);
          } catch (error) {
            console.error('Error updating user data in local storage:', error);
          }
        }

        this.activeModal.close();
      },
      error: (err) => {
        console.error('Error updating welcome screen status:', err);
        this.activeModal.close();
      },
    });
  }
}
