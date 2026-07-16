import { Component, OnInit } from '@angular/core';
import { AuthUtils } from '../../shared/utility/auth-utils';
import { CommunityService } from '../service/community.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.scss'
})
export class BlogsComponent implements OnInit{
  communityDetails:any;
  blogList:any = []
  constructor(private communityService :CommunityService,
    public router: Router,
    private activateRoute : ActivatedRoute,
    private apiService: ApiService){}

  ngOnInit(): void {
    const parentParamMap = this.activateRoute?.parent?.snapshot?.paramMap;
    const id = parentParamMap ? parentParamMap.get('communityId') : null;
    this.getPostingUserDetails(id)
  }

  getBlog(){
    this.communityService.getCommunityBlog(0,this.communityDetails?.postingTags[0]?.hashTag?.id).subscribe({
      next:(res)=>{
        this.blogList = res.data.map((val:any)=>{
          return {...val,blog:{...val.blog, thumbnail: `data:image/jpeg;charset=utf-8;base64,${val?.blog?.thumbnail}`}}
        });
        // console.log(this.blogList)
      }
    });
  }

  readMore(item:any){
    this.router.navigate(['home/blog-details', item.postingId]);
  }

  getPostingUserDetails(id:any){
    this.apiService.getPostingUserDetails(id).subscribe({
      next:(res)=>{
        this.communityDetails = res.data;
        this.getBlog();
      }
    });
  }

}
