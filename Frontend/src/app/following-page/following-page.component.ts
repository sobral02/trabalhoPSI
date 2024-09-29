import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-following-page',
  templateUrl: './following-page.component.html',
  styleUrls: ['./following-page.component.css']
})
export class FollowingPageComponent implements OnInit {
  following:string[]=[];
  name:string="";
  message:string="";

  constructor(
    private route: ActivatedRoute,
    private userService:UserService,
  ) {}

  ngOnInit(): void {
    const userName = this.route.snapshot.paramMap.get('name')!;
    this.name=userName;
    this.userService.getUser(userName).pipe().subscribe(res=>{
      this.following=res.followingLists;
      if (res.followingLists.length===0){
        this.message=`O ${this.name} não segue ninguém.`
      }
    });
  }
  dashboard() {
    this.userService.routeHere('/dashboard');
  }
  goToUser(name:string){
    this.userService.routeHere(`user/${name}`);
  }
}
