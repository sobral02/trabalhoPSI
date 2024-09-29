import { Component, OnInit } from '@angular/core';

import { of } from 'rxjs';
import { catchError, map, switchMap, tap} from 'rxjs/operators';
import { UserService } from '../user.service';
import { ItemService } from '../item.service';
import { User } from '../user';
import { Item } from '../item';


@Component({
  selector: 'app-carrinho-detail',
  templateUrl: './carrinho-detail.component.html',
  styleUrls: ['./carrinho-detail.component.css']
})
export class CarrinhoDetailComponent implements OnInit {

  currentUser: User | undefined;
  total:number=0;
  items: Item[] = [];
  message:string="";
  static getTotal: any;

  constructor(
    private userService: UserService,
    private itemService: ItemService
  ) {}

  ngOnInit(): void {
    this.total=0;
    this.message="Loading..."
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
        this.initPreco(this.currentUser!.carrinho);
      });
  }

  initPreco(carrinho:string[]){
    if(carrinho.length===0){
      this.message=`Não existe items no carrinho do ${this.currentUser?.name}.`;
    }
    for(let item of carrinho){
      let itemName = item.split("|")[0];
      let itemQuantity = parseInt(item.split("|")[1]);
      this.userService.getItemPreco(itemName).subscribe((preco:number)=>{
        this.total+=preco*itemQuantity;
        this.message="Preço total: "+this.total;
      });
    }
    
  }

  incItem(citem: string): void {
      this.itemService
        .addItemToUserCart(citem.split('|')[0])
        .pipe(
          tap(() => {
            this.ngOnInit();
          }),
          catchError((error) => {
            console.error('Erro ao adicionar item ao carrinho:', error);
            return of(null);
          })
        )
        .subscribe();
  }

  decItem(citem: string): void {
      this.itemService
        .decItemToUserCart(citem.split('|')[0])
        .pipe(
          tap(() => {
            this.ngOnInit();
          }),
          catchError((error) => {
            console.error('Erro ao adicionar item ao carrinho:', error);
            return of(null);
          })
        )
        .subscribe();
  }
  dashboard() {
    this.userService.routeHere('/dashboard');
  }
  checkoutPage(){
    this.userService.routeHere('/checkout/' + this.currentUser?.name);

  }
    
  }

