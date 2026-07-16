import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-invite-redirect',
  template: '',
})
export class InviteRedirectComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');
    if (token) {
      this.router.navigate(['/auth/register'], { queryParams: { inviteToken: token } });
    } else {
      this.router.navigate(['/auth/register']);
    }
  }
} 