import { Component, OnInit } from '@angular/core';
import { BlogMeta } from './blogsMeta';
import { BlogService } from '../../../home/blog/service/blog.service';
import { CommonService } from '../../../common/common.service';
import { DatePipe } from '@angular/common';
import { VideoService } from '../../../home/videos/service/video.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthUtils } from '../../../shared/utility/auth-utils';

@Component({
  selector: 'app-moderator-blogs',
  templateUrl: './moderator-blogs.component.html',
  styleUrl: './moderator-blogs.component.scss'
})
export class ModeratorBlogsComponent implements OnInit{
  blogHeader:any = [];
  blogData:any = [];
  page:number = 0;
  userInfo:any;
  constructor(private blogService : BlogService,
    public router: Router,
    private route: ActivatedRoute
  ){}
  ngOnInit(): void {
    this.blogHeader = BlogMeta;
    this.page = 0;
    
    // Check if we're in the user's own content section or viewing someone else's profile
    const currentUrl = this.router.url;
    const isUserProfile = currentUrl.includes('/user-profile/content-published');
    
    if (isUserProfile) {
      // For user's own content section, use logged in user's details
      let data:any = AuthUtils.getUserDetails();
      this.userInfo = JSON.parse(data);
    } else {
      // For viewing other profiles, use the profile being viewed
      let data:any = AuthUtils.getProfile();
      this.userInfo = JSON.parse(data);
    }
    
    console.log(this.userInfo)
    this.getBlogList();
  }

  navigate(item:any){
    this.router.navigate(['home/blog-details', item.postingId]);
  }

  getBlogList(){
    this.blogService.getOnlyBlogs(this.page,10,this.userInfo.userId).subscribe({
      next:(res:any)=>{
        this.blogData = this.blogData.concat(
          res.data.map((val: any, index: number) => {
            val.seq = index + 1;
            // Format date
            val.createdDate = new DatePipe('en-US').transform(
              val.createdDate,
              'dd/MM/yyyy'
            );
            // Favourites count
            // Use favouriteCount returned from backend; fallback to 0 if undefined
            val.Fav = val.favouriteCount ?? 0;

            // Prepare a base64 thumbnail image (if available)
            if (val?.blog?.thumbnail) {
              val.thumbnail = `data:image/jpeg;charset=utf-8;base64,${val.blog.thumbnail}`;
            }

            // Add a short title (optional)
            val.shortTitle = val.title?.slice(0, 50);

            return val;
          })
        );
        // console.log(this.blogData);
      },
        error:(err:any)=>{

        }
    })
  }

  apiCalled(event:any){
    this.page++;
    this.getBlogList();
  }

}
