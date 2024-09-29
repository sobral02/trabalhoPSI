import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.css']
})
export class UserSearchComponent implements OnInit{
  
  ufilter: string = "";
  users: User[] = [];
  filteredUsers: User[] = [];
  showMessage: boolean=false;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((resd) => {
      if (resd) {
        this.users = resd;
      }
    });
  }

  pesquisar(): void {
    this.showMessage=false;
    if(this.ufilter.trim().length > 1) {
      this.filteredUsers = this.users.filter(u => u.name.includes(this.ufilter));
      if(this.filteredUsers.length == 0) {
        //alert("Não existe utilizador que correspondem a esse filtro.");
        this.showMessage=true;
      }
    } 
  }

  goProfile(name:string): void {
    this.router.navigate(['user',name]);
  }         
}
