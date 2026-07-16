import { Component } from '@angular/core';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrl: './terms-and-conditions.component.scss',
})
export class TermsAndConditionsComponent {
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
