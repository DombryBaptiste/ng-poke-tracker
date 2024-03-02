import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Pokemon } from "../../Entity/Pokemon";
import { PokemonService } from "../../Services/pokemon.service";
import { CommonModule } from "@angular/common";
import { PokemonComponent } from "../pokemon/pokemon.component";
import { Gender } from "../../Enum/Gender";
import { MatTabsModule } from "@angular/material/tabs";
import { PokemonSpecific } from "../../Enum/PokemonSpecific";

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
  alternatePokemons: Pokemon[] = [];
  regionalForms: Pokemon[] = [];
  vivillon: Pokemon[];
  pikachuCap: Pokemon[];
  unown: Pokemon[];
  unknownRegion: Pokemon[];
  hisui: Pokemon[];
  hisuiRegional: Pokemon[];
  gmax: Pokemon[];

  malePokemonsSub: Pokemon[][] = [];
  femalePokemonSub: Pokemon[][] = [];
  alternatePokemonsSub: Pokemon[][] = [];
  gmaxSub: Pokemon[][] = [];
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
    this.pokemonService
      .getPokemonAlternateByGenerationId(this.generationId, Gender.Alternate)
      .subscribe((data) => {
        this.alternatePokemons = data;
        this.chunckPokemonAlternate();
      });

    this.pokemonService
      .getPokemonAlternateByGenerationId(this.generationId, Gender.Regional)
      .subscribe((data) => {
        this.regionalForms = data;
      });

    if (this.generationId == 6) {
      this.vivillon = this.pokemonService.getSpecificPokemon(
        PokemonSpecific.Vivillon
      );
    }
    if (this.generationId == 1) {
      this.pikachuCap = this.pokemonService.getSpecificPokemon(
        PokemonSpecific.PikachuCap
      );
    }
    if (this.generationId == 2) {
      this.unown = this.pokemonService.getSpecificPokemon(
        PokemonSpecific.Unown
      );
    }

    if (this.generationId == 7) {
      this.unknownRegion = this.pokemonService.getSpecificPokemon(
        PokemonSpecific.UnknownRegion
      );
    }
    if (this.generationId == 8) {
      this.gmax = this.pokemonService.getSpecificPokemon(
        PokemonSpecific.Gigantamax
      );
      this.hisui = this.pokemonService.getSpecificPokemon(
        PokemonSpecific.Hisui
      );
      this.pokemonService
        .getPokemonAlternateByGenerationId(81, Gender.Regional)
        .subscribe((data) => {
          this.hisuiRegional = data;
        });
    }
    this.chunckPokemon();
  }

  chunckPokemon() {
    const chunkSize = 30;
    for (let i = 0; i < this.malePokemons.length; i += chunkSize) {
      this.malePokemonsSub.push(this.malePokemons.slice(i, i + chunkSize));
    }

    for (let i = 0; i < this.femalePokemons.length; i += chunkSize) {
      this.femalePokemonSub.push(this.femalePokemons.slice(i, i + chunkSize));
    }

    for (let i = 0; i < this.gmax.length; i += chunkSize) {
      this.gmaxSub.push(this.gmax.slice(i, i + chunkSize));
    }
  }

  chunckPokemonAlternate() {
    const chunkSize = 30;
    for (let i = 0; i < this.alternatePokemons.length; i += chunkSize) {
      this.alternatePokemonsSub.push(
        this.alternatePokemons.slice(i, i + chunkSize)
      );
    }
  }
}
