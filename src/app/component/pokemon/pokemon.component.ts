import { Component, Input, OnInit } from '@angular/core';
import { Pokemon } from '../../Entity/Pokemon';
import { CommonModule } from '@angular/common';
import { PokemonOwnedService } from '../../Services/pokemonOwned.service';

@Component({
  selector: 'app-pokemon',
  standalone: true,
  imports: [CommonModule],
  templateUrl:"pokemon.component.html",
  styleUrl: "pokemon.component.css"
})
export class PokemonComponent implements OnInit{
  @Input() pokemon: Pokemon;

  showName: boolean = false;
  pokemonsOwned: Pokemon[];

  constructor(private pokemonOwnedService: PokemonOwnedService) { }
  
  ngOnInit(): void {
    this.pokemonOwnedService.pokemonsOwned$.subscribe(pokemons => {
      this.pokemonsOwned = pokemons;
    });
  }

  hasPokemonUser(id: number)
  {
    const foundPokemon = this.pokemonsOwned.find((pkm: Pokemon) => pkm.id === id);
    return foundPokemon;
  }

  showPokemonName() {
    this.showName = true;
  }

  hidePokemonName() {
    this.showName = false;
  }

  clickInterationPokemon(pokemonId: number)
  {
    if(this.hasPokemonUser(pokemonId))
    {
      this.pokemonsOwned = this.pokemonsOwned.filter(pokemon => pokemon.id !== pokemonId);
    }
    else
    {
      this.pokemonsOwned.push(this.pokemon);
    }
    this.pokemonOwnedService.updatePokemonsOwned(this.pokemonsOwned)
  }
}
