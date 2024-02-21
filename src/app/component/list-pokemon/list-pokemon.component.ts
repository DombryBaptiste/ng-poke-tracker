import { Component, Input, OnInit} from '@angular/core';
import { Pokemon } from '../../Entity/Pokemon';
import { PokemonService } from '../../Services/pokemon.service';
import { CommonModule } from '@angular/common';
import { PokemonComponent } from '../pokemon/pokemon.component';
import { UserData } from '../../Entity/UserData';

@Component({
  selector: 'app-list-pokemon',
  standalone: true,
  imports: [CommonModule, PokemonComponent],
  templateUrl: "list-pokemon.component.html",
  styleUrl: "list-pokemon.component.css"
})
export class ListPokemonComponent implements OnInit{
  @Input() generationId: number;
  @Input() user: UserData;

  pokemons: Pokemon[];
  pokemonsWithoutMale: Pokemon[];

  constructor(public pokemonService: PokemonService) { }

  ngOnInit(): void
  {
    this.pokemons = this.pokemonService.getPokemonByGeneration(this.generationId);
    this.pokemonsWithoutMale = this.pokemons.filter(p => p.femaleSprite != null); 
  }

}
