import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { catchError } from 'rxjs';
import { Item } from '../item';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  username: string | null = null;
  route: any;

  ufilter: string = '';
  filteredItems: Item[] = [];
  items: Item[] = [];
  showMessage: boolean = false;

  constructor(
    private userService: UserService,
    private itemService: ItemService
  ) {}


  ngOnInit(): void {
    this.itemService.getAllItems().subscribe((resd) => {
      if (resd) {
        this.items = resd;
      }
    });

    this.userService
    .getCurrentUser()
    .pipe(
      catchError((error: any) => {
        this.userService.routeHere('/');
        return [];
      })
    )
    .subscribe((res: any) => {
      this.currentUser = res;
    });
  }

  updateUsername(user: User | null): void {
    if (user) {
      this.username = user.name;
    } else {
      this.username = null;
    }
  }

  logout() {
    this.userService
      .logout()
      .pipe(
        catchError((error: any) => {
          throw error;
        })
      )
      .subscribe((res: any) => {
        this.username = null;
        this.userService.routeHere('/');
      });
  }

  getUserProfile() {
    this.userService.routeHere('/user/' + this.currentUser?.name);
  }

  searchUsers(): void {
    this.userService.routeHere('/user-search');
  }

  pesquisar(): void {
    this.showMessage = false;
    if (this.ufilter.trim().length > 1) {
      this.filteredItems = this.items.filter((i) =>
        i.name.includes(this.ufilter)
      );
      if (this.filteredItems.length == 0) {
        this.showMessage = true;
      }
    }
  }

  goItem(name: string): void {
    name = name.split("|")[0]
    this.userService.routeHere('/item/' + name);
  }

  wishlist() {
    this.userService.routeHere('/wishlist/' + this.currentUser?.name);
  }

  removerItem(itemName: string) {
    this.currentUser!.wishlist = this.currentUser?.wishlist.filter(
      (item) => item !== itemName
    )!;
    this.itemService.removeItemWishlist(itemName);
  }
  gotoUserProfile(name: string) {
    console.log(name);
    this.userService.routeHere(`user/${name}`);
  }
  checkOut(){
    this.userService.routeHere('/checkout/' + this.currentUser?.name);

  }
  openCarrinho(): void {
    this.userService.routeHere(`carrinho`);
  }
}

