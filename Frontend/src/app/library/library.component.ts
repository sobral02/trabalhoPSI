import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent {
  library:string[]=[];
  name:string="";
  message:string="";
  librarySort:string[]=[];
  modo:string="Alfabeticamente"

  constructor(
    private route: ActivatedRoute,
    private userService:UserService,
  ) {}

  ngOnInit(): void {
    const userName = this.route.snapshot.paramMap.get('name')!;
    this.name=userName;
    this.userService.getUser(userName).pipe().subscribe(res=>{
      this.library=res.library;
      this.librarySort=[...res.library];
      this.librarySort.sort((a, b) => a.localeCompare(b));
      if(res.library.length===0){
        this.message=`O ${res.name} não possui itens na sua biblioteca.`;
      }

    });
  }
  dashboard() {
    this.userService.routeHere('/dashboard');
  }
  goToItem(item:string){
    this.userService.routeHere('/item/'+item);
  }

  swapSort(){
    if(this.modo==="por Data"){
      this.modo="Alfabeticamente";
    }else{
      this.modo="por Data";
    }
    var x=[...this.library];
    this.library=[...this.librarySort];
    this.librarySort=[...x];
  }
  
}