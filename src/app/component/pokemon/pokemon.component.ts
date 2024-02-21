import { Component, Input } from '@angular/core';
import { Pokemon } from '../../Entity/Pokemon';
import { CommonModule } from '@angular/common';
import { UserData } from '../../Entity/UserData';

@Component({
  selector: 'app-pokemon',
  standalone: true,
  imports: [CommonModule],
  templateUrl:"pokemon.component.html",
  styleUrl: "pokemon.component.css"
})
export class PokemonComponent {
  @Input() pokemon: Pokemon;
  @Input() user: UserData;

  showName: boolean = false;
  

  hasPokemonUser(id: number)
  {
    const foundPokemon = this.user.pokemon.find((pkm: Pokemon) => pkm.id === id);
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
      this.user.pokemon = this.user.pokemon.filter(pokemon => pokemon.id !== pokemonId);
    }
    else
    {
      this.user.pokemon.push(this.pokemon);
    }
  }
}
