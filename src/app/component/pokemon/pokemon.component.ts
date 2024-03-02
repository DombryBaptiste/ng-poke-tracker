import { Component, Input, OnInit } from "@angular/core";
import { Pokemon } from "../../Entity/Pokemon";
import { CommonModule } from "@angular/common";
import { PokemonOwnedService } from "../../Services/pokemonOwned.service";

@Component({
  selector: "app-pokemon",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "pokemon.component.html",
  styleUrl: "pokemon.component.css",
})
export class PokemonComponent implements OnInit {
  @Input() pokemon: Pokemon;

  showName: boolean = false;
  pokemonsOwned: Pokemon[];
  pokemonOwn: Pokemon | undefined;

  constructor(private pokemonOwnedService: PokemonOwnedService) {}

  ngOnInit(): void {
    this.pokemonOwnedService.pokemonsOwned$.subscribe((pokemons) => {
      this.pokemonsOwned = pokemons;
    });
  }

  hasPokemonUser() {
    const foundPokemon = this.pokemonsOwned.find(
      (pkm: Pokemon) => pkm == this.pokemon
      //pkm.id === this.pokemon.id && pkm.gender == this.pokemon.gender && pkm.name == this.pokemon.name
    );
    this.pokemonOwn = foundPokemon;
    return foundPokemon;
  }

  showPokemonName() {
    this.showName = true;
  }

  hidePokemonName() {
    this.showName = false;
  }

  addPokemon() {
    let pokemonIndex = this.pokemonsOwned.findIndex(
      (p) => p.id === this.pokemon.id && p.gender === this.pokemon.gender
    );

    if (pokemonIndex !== -1) {
      this.pokemonsOwned[pokemonIndex].count++;
    } else {
      this.pokemon.addedDate = new Date().toLocaleString();
      this.pokemon.count = 1;
      this.pokemonsOwned.push(this.pokemon);
    }
    this.pokemonOwnedService.updatePokemonsOwned(this.pokemonsOwned);
  }

  supressPokemon(event: Event) {
    event.preventDefault();

    let pokemonIndex = this.pokemonsOwned.findIndex(
      (p) => p.id === this.pokemon.id && p.gender === this.pokemon.gender
    );

    if (pokemonIndex !== -1) {
      if (this.pokemonsOwned[pokemonIndex].count == 1) {
        this.pokemonsOwned = this.pokemonsOwned.filter(
          (pokemon) =>
            pokemon.id !== this.pokemon.id ||
            pokemon.gender !== this.pokemon.gender
        );
      } else {
        this.pokemonsOwned[pokemonIndex].count--;
      }
    }
    this.pokemonOwnedService.updatePokemonsOwned(this.pokemonsOwned);
  }
}
