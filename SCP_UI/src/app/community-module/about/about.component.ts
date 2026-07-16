import { Component, OnInit } from '@angular/core';
import { AuthUtils } from '../../shared/utility/auth-utils';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit{
  aboutDetails:any;
  constructor(private activateRoute : ActivatedRoute,
    private apiService: ApiService){}
  ngOnInit(): void {
    const parentParamMap = this.activateRoute?.parent?.snapshot?.paramMap;
    const id = parentParamMap ? parentParamMap.get('communityId') : null;
    this.getPostingUserDetails(id)
  }

  getPostingUserDetails(id:any){
    this.apiService.getPostingUserDetails(id).subscribe({
      next:(res)=>{
        this.aboutDetails = res.data;
      }
    });
  }

}
