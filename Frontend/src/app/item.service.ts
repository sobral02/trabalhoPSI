import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EMPTY, Observable, catchError, take } from 'rxjs';
import { Router } from '@angular/router';
import { Item } from './item';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  constructor(private http: HttpClient, private router: Router) {}
  private serverNodeUrl = 'http://appserver.alunos.di.fc.ul.pt:3058';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
  };

  getAllItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.serverNodeUrl + '/items',this.httpOptions);
  }

  getItemById(id: string): Observable<Item> {
    const url = `${this.serverNodeUrl}/items${id}`;
    return this.http.get<Item>(url,this.httpOptions);
  }

  getItemDetailsById(id: string, token: string): Observable<Item> {
    const url = `${this.serverNodeUrl}/items${id}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
         withCredentials:true,
    };
    return this.http.get<Item>(url, httpOptions);
  }

  getItem(name: String): Observable<Item> {
    return this.http.get<Item>(
      `${this.serverNodeUrl}/item/` + name,
      this.httpOptions
    );
  }
  addItemToUserCart(item: string) {
    const payload = { itemName: item };
    return this.http.put(
      `${this.serverNodeUrl}/user/cart/` + item,
      payload,
      this.httpOptions
    );
  }

  decItemToUserCart(item: string) {
    const payload = { itemName: item };
    return this.http.put(
      `${this.serverNodeUrl}/user/cart/dec/` + item,
      payload,
      this.httpOptions
    );
  }

  addItemToUserWishlist(item: string) {
    const payload = { name: item }; 
    return this.http.put(
      `${this.serverNodeUrl}/user/wishlist/` + item,
      payload,
      this.httpOptions
    );
  }

  async removeItemWishlist(item: string) {
    try {
      await this.http
        .delete(`${this.serverNodeUrl}/user/wishlist/` + item, this.httpOptions)
        .pipe(take(1), catchError((err) => {
          console.error('Error removing item from wishlist:', err);
          return EMPTY;
        }))
        .toPromise();
        return true;
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
      return false;
    }
  }

  updateItemRating(itemName: string, userName:string,rating:number,comment:string) {
    const payload={ name: userName,rating: rating,comment: comment};

    return this.http.put(
      `${this.serverNodeUrl}/item/rating/` + itemName,
      payload,
      this.httpOptions
    ).subscribe();

    
  }

}
