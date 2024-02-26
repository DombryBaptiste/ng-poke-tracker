import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './component/navbar/navbar.component';
import { UserData } from './Entity/UserData';
import { PokemonService } from './Services/pokemon.service';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from './Services/localStorage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styles: [],
})

export class AppComponent implements OnInit{

  initLoading: boolean = true;
  constructor(public pokemonService: PokemonService, public localstorageService: LocalStorageService) { }

  ngOnInit(): void {
    if(this.localstorageService.needInit() == true)
    {
      this.pokemonService.initPokemonLocalStorage().subscribe(() => {
        this.initLoading = false;
      });
    } else {
      this.initLoading = false;
    }
  }

 }
