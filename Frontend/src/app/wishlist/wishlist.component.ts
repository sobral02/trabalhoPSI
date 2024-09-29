import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../wishlist.service';
import { Item } from '../item';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, tap, timeout } from 'rxjs/operators';
import { User } from '../user';
import { UserService } from '../user.service';
import { ItemService } from '../item.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
})
export class WishlistComponent implements OnInit {
  items: string[] = []; // A lista de itens da wishlist
  itemName!: string;
  user: User | undefined;
  message:string="";
  currentUser: User | undefined;
  item: Item | undefined;

  constructor(
    private wishlistService: WishlistService,
    private route: ActivatedRoute,
    private userService: UserService,
    private itemService: ItemService
  ) {}

  ngOnInit(): void {
    const userName = this.route.snapshot.paramMap.get('name')!;
    this.userService.getUser(userName).subscribe((res) => {
      this.items = res.wishlist;
      this.user = res;
      if (res.wishlist.length===0){
        this.message=`O ${this.user.name} não tem nenhum item na wishlist.`
      }
    });
    this.userService.existsUser(userName).subscribe((bool) => {
      if (!bool) {
        this.userService.routeHere('/dashboard');
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

  loadItems() {
    this.wishlistService.getItems().subscribe((items) => {
      //this.items = items;
    });
  }

  addItem(itemName: string) {
    this.wishlistService.addItem(itemName).subscribe(() => {
      this.loadItems(), alert('item adicionado com sucesso');
    });
  }

  onSubmit() {
    this.wishlistService.addItem(this.itemName).subscribe(() => {
      this.loadItems(), alert('Item adicionado à wishlist!');
    });
    this.itemName = '';
  }

  removeItem(itemId: string) {
    this.wishlistService.removeItem(itemId).subscribe(() => {
      this.loadItems();
    });
  }

  goToItem(name:string){
    this.userService.routeHere(`item/${name}`);
  }

  dashboard() {
    this.userService.routeHere('/dashboard');
  }
}
