import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Pokemon } from "../../Entity/Pokemon";
import { PokemonService } from "../../Services/pokemon.service";
import { CommonModule } from "@angular/common";
import { PokemonComponent } from "../pokemon/pokemon.component";
import { Gender } from "../../Enum/Gender";
import { MatTabsModule } from "@angular/material/tabs";

@Component({
  selector: "app-list-pokemon",
  standalone: true,
  imports: [CommonModule, PokemonComponent, MatTabsModule],
  templateUrl: "list-pokemon.component.html",
  styleUrl: "list-pokemon.component.css",
})
export class ListPokemonComponent implements OnInit {
  @Input() generationId: number;

  showName: boolean = false;

  malePokemons: Pokemon[];
  femalePokemons: Pokemon[];

  malePokemonsSub: Pokemon[][] = [];
  pokemonsWithoutMale: Pokemon[];

  constructor(public pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.malePokemons = this.pokemonService.getPokemonsByGeneration(
      this.generationId,
      Gender.Male
    );
    this.femalePokemons = this.pokemonService.getPokemonsByGeneration(
      this.generationId,
      Gender.Female
    );
    this.chunckPokemon();
    console.log(this.malePokemonsSub);
  }

  chunckPokemon() {
    const chunkSize = 30;

    for (let i = 0; i < this.malePokemons.length; i += chunkSize) {
      this.malePokemonsSub.push(this.malePokemons.slice(i, i + chunkSize));
    }
  }
}
