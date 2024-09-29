import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-followers-page',
  templateUrl: './followers-page.component.html',
  styleUrls: ['./followers-page.component.css']
})
export class FollowersPageComponent implements OnInit {
  followers:string[]=[];
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
      this.followers=res.followerLists;
      if (res.followerLists.length==0){
        this.message=`O ${this.name} não tem seguidores.`
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
