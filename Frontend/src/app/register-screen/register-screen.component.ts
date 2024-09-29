import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { catchError, map } from 'rxjs';
import { User } from '../user';

@Component({
  selector: 'app-register-screen',
  templateUrl: './register-screen.component.html',
  styleUrls: ['./register-screen.component.css']
})
export class RegisterScreenComponent {

  registerMessage:String="";

  constructor(private userService:UserService){}


  ngOnInit(): void {
    this.userService.getCurrentUser()
  .pipe(
    catchError((error: any) => {
      return [];
    })
  )
  .subscribe((user: User) => {
    this.userService.routeHere('/dashboard');
  });

  }

  goLogin(){
    this.userService.routeHere('/login-screen');
  }

  isValidPassword(password: string): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
  }

  isValidUsername(username: string): boolean {
    const regex = /^[a-zA-Z0-9]{3,}$/;
    return regex.test(username);
  }
  register(name:string,password1:string,password2:string){
    if(!this.isValidUsername(name)){
      this.registerMessage="O username não cumpre os requisitos!";
      return;
    }
    if(!this.isValidPassword(password1)){
      this.registerMessage="A password não cumpre os requisitos!"
      return;
    }
    if (password1 !== password2){
      this.registerMessage="As passwords inseridas não são iguais!";
      return;
    }
      this.userService.existsUser(name).subscribe(bool=>{
        if(bool){
          this.registerMessage = "Um utilizador com esse username já existe!";
          return;
        }else{
          this.userService.registerUser({name,password:password1} as User).subscribe(string =>{
          this.registerMessage=string;
          }
            );
        }
      }
        
      );
  }
}

