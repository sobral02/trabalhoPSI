import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../user.service';
import { WishlistService } from '../wishlist.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../user';
import { ItemService } from '../item.service';
import { Item } from '../item';
import { catchError } from 'rxjs';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  isclicked = false;
  isSuccessful = false;
  elementRef: any;
  checkoutForm: FormGroup;
  user: User | undefined;
  currentUser: User | undefined;
  item: Item | undefined;
  itemsWish: string[] = []; // A lista de itens da wishlist
  itemsCarrinho: Item[] = [];

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private wishlistService: WishlistService,
              private route: ActivatedRoute,
              private itemService: ItemService) {
  
      this.checkoutForm = this.fb.group({
      address: ['', Validators.required],
      nif: ['', Validators.required],
    });
    
  }

  ngOnInit(): void {
    const userName = this.route.snapshot.paramMap.get('name')!;
    this.userService.getUser(userName).subscribe((res) => {
      this.itemsWish = res.wishlist;
      this.user = res;
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
      this.itemService.getAllItems().subscribe((resd) => {
        if (resd) {
          this.itemsCarrinho = resd;
        }
      });

  }
  


  openMbway() {
    const mbwayForm = document.getElementById("mbway-form");
    const creditForm = document.getElementById("credit-form");
    
    if (mbwayForm && creditForm) {
      mbwayForm.style.display = "block";
      creditForm.style.display = "none";
    }
  }
  
  openCredit() {
    
    const mbwayForm = document.getElementById("mbway-form");
    const creditForm = document.getElementById("credit-form");
    
    if (mbwayForm && creditForm) {
      mbwayForm.style.display = "none";
      creditForm.style.display = "block";
    }
  }

  checkout(): void {
    this.isclicked = true;
    const randomNumber = Math.random();

    if (randomNumber < 0.5) {
      this.isSuccessful = true;
      this.removeItemsWishlist();
    } else {
      this.isSuccessful = false;
    }
  }

  dashboard(){
    this.userService.routeHere('/dashboard');

  }
  removeItemsWishlist() {
    

    this.userService.removeItems(this.currentUser!.carrinho).subscribe(res => {this.currentUser!.carrinho = [];} 
    
        
      ),
      catchError((error: any) => {
        throw error;

      });
    
      

  
  }
}

