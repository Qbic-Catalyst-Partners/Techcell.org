import { Component } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss',
})
export class PrivacyPolicyComponent {
  items = [
    {
      version: '1.0',
      date: '15/May/24',
      docEditor: 'Director',
      comment: 'Initial Version',
    },
    {
      version: '',
      date: '',
      docEditor: '',
      comment: '',
    },
    {
      version: '',
      date: '',
      docEditor: '',
      comment: '',
    },
  ];
}
