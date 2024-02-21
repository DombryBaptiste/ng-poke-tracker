import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './component/navbar/navbar.component';
import { UserService } from './Services/user.service';
import { UserData } from './Entity/UserData';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styles: [],
})

export class AppComponent implements OnInit{

  public user: UserData;
  constructor(public userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUserInfoById(1).subscribe(user => {
      this.user = user;
      
      console.log(user);
    })
  }

 }
