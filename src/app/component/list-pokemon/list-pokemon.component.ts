import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Pokemon } from '../../Entity/Pokemon';
import { PokemonService } from '../../Services/pokemon.service';
import { CommonModule } from '@angular/common';
import { PokemonComponent } from '../pokemon/pokemon.component';
import { UserData } from '../../Entity/UserData';
import { LocalStorageService } from '../../Services/localStorage.service';
import { PokemonOwnedService } from '../../Services/pokemonOwned.service';

@Component({
  selector: 'app-list-pokemon',
  standalone: true,
  imports: [CommonModule, PokemonComponent],
  templateUrl: "list-pokemon.component.html",
  styleUrl: "list-pokemon.component.css"
})
export class ListPokemonComponent implements OnInit{
  @Input() generationId: number;

  showName: boolean = false;

  pokemons: Pokemon[];
  pokemonsWithoutMale: Pokemon[];

  constructor(public pokemonService: PokemonService) { }

  ngOnInit(): void
  {
    this.pokemons = this.pokemonService.getPokemonByGeneration(this.generationId);
  }

}
