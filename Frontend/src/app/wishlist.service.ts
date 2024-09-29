import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Item } from './item';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private serverNodeUrl = 'http://appserver.alunos.di.fc.ul.pt:3058';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
  };

  constructor(private http: HttpClient) {}

  getItems(): Observable<string[]> {
    const url = `${this.serverNodeUrl}/user/wishlist/`;
    return this.http.get<string[]>(url,this.httpOptions);
  }

  addItem(itemName: string): Observable<any> {
    const url = `${this.serverNodeUrl}/wishlist`;
    return this.http.post(url, { itemName },this.httpOptions);
  }

  removeItem(itemId: string): Observable<any> {
    const url = `${this.serverNodeUrl}/user/wishlist/${itemId}`;
    return this.http.delete(url,this.httpOptions);
  }

}
