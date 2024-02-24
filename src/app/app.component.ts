import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './component/navbar/navbar.component';
import { UserData } from './Entity/UserData';
import { PokemonService } from './Services/pokemon.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styles: [],
})

export class AppComponent implements OnInit{

  public user: UserData;
  constructor(public pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.pokemonService.initPokemonLocalStorage();
  }

 }
