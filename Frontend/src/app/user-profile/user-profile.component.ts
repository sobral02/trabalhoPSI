import { Component, OnInit } from '@angular/core';

import { catchError, map, switchMap } from 'rxjs/operators';
import { UserService } from '../user.service';
import { User } from '../user';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  currentUser: User | undefined;
  name: String | undefined;

  user: User | undefined;
  userFollowers: number = 0;
  following: boolean = false;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const userName = this.route.snapshot.paramMap.get('name')!;
    this.userService.getUser(userName).subscribe((res) => {
      this.user = res;
      this.userFollowers = this.user.followerLists.length;
    });

    this.userService
      .getCurrentUser()
      .pipe(
        catchError((error: any) => {
          this.userService.routeHere('/');
          return [];
        })
      )
      .subscribe((user) => {
        this.currentUser = user;
        this.following = user.followingLists.includes(userName);
      });
  }

  dashboard() {
    this.userService.routeHere('/dashboard');
  }

  goToItem(item: String) {
    this.userService.routeHere('/item/' + item);
  }

  goToWishlist() {
    this.userService.routeHere('/wishlist/' + this.user?.name);
  }

  unfollowUser() {
    const pageUser = this.route.snapshot.paramMap.get('name')!;
    const payload = { name: this.currentUser?.name };
    this.userService.unfollowUser(pageUser, payload).subscribe((res: any) => {
      if (res !== 'Unfollowed successfully') {
        alert(res);
      } else {
        if (this.currentUser?.followingLists) {
          this.currentUser.followingLists =
            this.currentUser.followingLists.filter((item) => item !== pageUser);
        }
        this.userFollowers--;
        this.following = false;
      }
    });
  }

  editProfile() {
    this.userService.routeHere('/edit-profile/' + this.user?.name);
  }
  followUser() {
    const pageUser = this.route.snapshot.paramMap.get('name')!;
    const payload = { name: this.currentUser?.name };
    if (pageUser === payload.name) {
      alert('Não pode seguir a si mesmo');
      return;
    } else if (this.currentUser?.followingLists.includes(pageUser)) {
      alert('Já segue este utilizador');
      return;
    }
    this.userService.followUser(pageUser, payload).subscribe((res: any) => {
      if (res !== 'Followed successfully') {
        alert(res);
      } else {
        this.currentUser?.followingLists.push(pageUser);
        this.userFollowers++;
        this.following = true;
      }
    });
  }

  goToFollowers() {
    this.userService.routeHere('/followers/' + this.user?.name);
  }
  goToFollowing() {
    this.userService.routeHere('/following/' + this.user?.name);
  }
  goToLibrary() {
    this.userService.routeHere('library/' + this.user?.name);
  }
}
