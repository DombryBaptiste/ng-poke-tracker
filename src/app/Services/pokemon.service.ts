import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { Pokemon } from "../Entity/Pokemon";
import { LocalStorageService } from "./localStorage.service";

@Injectable({
  providedIn: "root",
})
export class PokemonService {
  private readonly pokemonIdInGen8_9 = [810, 1025];
  private readonly InitPokemonRange = {
    startId: 1,
    endId: 649,
  };
  private readonly GenerationRange: { [key: number]: number[] } = {
    1: [1, 151],
    2: [152, 251],
    3: [252, 386],
    4: [387, 493],
    5: [494, 649],
    6: [650, 721],
    7: [722, 809],
    8: [810, 905],
    9: [906, 1025]
  };
  private readonly generationWithNoFemaleSprite: string[] = [
    "generation-i",
    "generation-ii",
    "generation-iii",
  ];
  private readonly generationWithNoTransparentSprite: string[] = [
    "generation-i",
    "generation-ii",
  ];
  private readonly gen3FormsId: number[] = [10001, 10002, 10003];
  private readonly gen4FormsId: number[] = [10034, 10035, 10004, 10005, 10039, 10040, 10008, 10009, 10010, 10011, 10012, 10006];
  private readonly gen5FormsId: number[] = [100068, 100069, 100070, 100071, 10072, 10073, 10016, 10019, 10020, 10021, 10024];

  private readonly pickachuCapId: number[] = []

  constructor(
    private http: HttpClient,
    private localstorageService: LocalStorageService
  ) {}

  getPokemonByGeneration(id: number): Pokemon[] {
    let pokemonLocal = this.localstorageService.getData(
      `ListAllPokemon`
    );
    let pokemonList: Pokemon[] = [];
    if (pokemonLocal) {
      pokemonList = JSON.parse(pokemonLocal);
      pokemonList = pokemonList.map((pokemon, index) => {
        if (index === 0) {
          return pokemon;
        } else {
          return pokemonList[index - 1];
        }
      });
    }

    let pokemons: Pokemon[] = [];
    let startPokemonId = this.GenerationRange[id][0];
    let endPokemonId = this.GenerationRange[id][1];

    for (let i = startPokemonId; i <= endPokemonId; i++)
    {
      pokemons.push(pokemonList[i]);
    }
    return pokemons;
  }

  getPokemonById(id: number): Observable<Pokemon> {
    return this.http
      .get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .pipe(
        map((data: any) => ({
          id: data.id,
          height: data.height,
          name: data.name,
          maleSprite: this.getMaleSprite(data, id),
          femaleSprite: this.getFemaleSprite(data, id),
        }))
      );
  }

  getGenerationById(id: number): string {
    if (id >= 1 && id <= 151) {
      return "generation-i";
    }
    if (id >= 152 && id <= 251) {
      return "generation-ii";
    }
    if (id >= 252 && id <= 386) {
      return "generation-iii";
    }
    if (id >= 387 && id <= 493) {
      return "generation-iv";
    }
    if (id >= 494 && id <= 649) {
      return "generation-v";
    }
    if (id >= 650 && id <= 721) {
      return "generation-vi";
    }
    if (id >= 722 && id <= 807) {
      return "generation-vii";
    }
    if (id >= 810 && id <= 898) {
      return "generation-viii";
    }
    if (id >= 906 && id <= 1025) {
      return "generation-ix";
    } else {
      return "";
    }
  }

  getGameById(id: number): string {
    if (id >= 1 && id <= 151) {
      return "red-blue";
    }
    if (id >= 152 && id <= 251) {
      return "crystal";
    }
    if (id >= 252 && id <= 386) {
      return "emerald";
    }
    if (id >= 387 && id <= 493) {
      return "platinum";
    }
    if (id >= 494 && id <= 649) {
      return "black-white";
    }
    if (id >= 650 && id <= 721) {
      return "x-y";
    }
    if (id >= 722 && id <= 807) {
      return "ultra-sun-ultra-moon";
    }
    else {
      return "";
    }
  }

  hasFemaleSprite(idPokemon: number): boolean {
    return !this.generationWithNoFemaleSprite.includes(
      this.getGenerationById(idPokemon)
    );
  }

  hasGenderDiff(data: any): boolean {
    return data.sprites.back_female != null;
  }

  hasTransparentSprite(idPokemon: number): boolean {
    return !this.generationWithNoTransparentSprite.includes(
      this.getGenerationById(idPokemon)
    );
  }

  getMaleSprite(data: any, idPokemon: number)
  {
    if(this.hasOlderSprite(idPokemon))
    {
      if (this.hasTransparentSprite(idPokemon)) {
        return data.sprites.versions
        [this.getGenerationById(idPokemon)]
        [this.getGameById(idPokemon)].front_default;
      } else {
        return data.sprites.versions
        [this.getGenerationById(idPokemon)]
        [this.getGameById(idPokemon)].front_transparent;
      }
    }
    else {
      return data.sprites.front_default;
    }
  }

  getFemaleSprite(data: any, idPokemon: number)
  {
    if(this.hasFemaleSprite(idPokemon))
    {
      return data.sprites.versions
      [this.getGenerationById(idPokemon)]
      [this.getGameById(idPokemon)].front_female;
    }
    if (this.hasGenderDiff(data)) {
      if (this.hasTransparentSprite(idPokemon)) {
        return data.sprites.versions
        [this.getGenerationById(idPokemon)]
        [this.getGameById(idPokemon)].front_default;
      } else {
        return data.sprites.versions
        [this.getGenerationById(idPokemon)]
        [this.getGameById(idPokemon)].front_transparent;
      }
    } else {
      return null;
    }
  }

  hasOlderSprite(idPokemon: number)
  {
    if(idPokemon >= this.pokemonIdInGen8_9[0] && idPokemon <= this.pokemonIdInGen8_9[1])
      {
        return false;
      }
      return true; 
  }

  getSprite(data: any, genre: string, idPokemon: number) {
    if (genre == "male") {
      if(idPokemon >= this.pokemonIdInGen8_9[0] && idPokemon <= this.pokemonIdInGen8_9[1])
      {
        
      }
      else {
        if (this.hasTransparentSprite(idPokemon)) {
          return data.sprites.versions[this.getGenerationById(idPokemon)][
            this.getGameById(idPokemon)
          ].front_default;
        } else {
          return data.sprites.versions[this.getGenerationById(idPokemon)][
            this.getGameById(idPokemon)
          ].front_transparent;
        }
      }
      
    }
    if (genre == "female") {
      if (this.hasFemaleSprite(idPokemon)) {
        return data.sprites.versions[this.getGenerationById(idPokemon)][
          this.getGameById(idPokemon)
        ].front_female;
      }
      if (this.hasGenderDiff(data)) {
        if (this.hasTransparentSprite(idPokemon)) {
          return data.sprites.versions[this.getGenerationById(idPokemon)][
            this.getGameById(idPokemon)
          ].front_default;
        } else {
          return data.sprites.versions[this.getGenerationById(idPokemon)][
            this.getGameById(idPokemon)
          ].front_transparent;
        }
      }
    } else {
      return null;
    }
  }

  initPokemonLocalStorage() {
    if (this.localstorageService.getData("ListAllPokemon") == null) {
      let pokemons: Pokemon[] = this.getAllPokemon();
      this.localstorageService.saveData(
        "ListAllPokemon",
        JSON.stringify(pokemons)
      );
    }

    if (this.localstorageService.getData("pokemonOwned") == null) {
      this.localstorageService.saveData("pokemonOwned", "");
    }
  }

  getPokemonOwnedLocalStorage(): Pokemon[] {
    let pokemons: Pokemon[] = [];
    let pokemonOwned: string | null =
      this.localstorageService.getData("pokemonOwned");
    if (pokemonOwned) {
      pokemons = JSON.parse(pokemonOwned);
    }
    return pokemons;
  }

  getAllPokemon(): Pokemon[] {
    let pokemons: Pokemon[] = [];
    let startPokemonId: number = this.InitPokemonRange.startId;
    let endPokemonId: number = this.InitPokemonRange.endId;

    for (let i = startPokemonId; i <= endPokemonId; i++) {
      this.getPokemonById(i).subscribe((pkm) => {
        pokemons.push(pkm);
      });
    }

    return pokemons;
  }

  getAllPokemonByGeneration(generationId: number): Pokemon[] {
    let pokemons: Pokemon[] = [];
    let startPokemonId: number = this.GenerationRange[generationId][0];
    let endPokemonId: number = this.GenerationRange[generationId][1];

    for (let i = startPokemonId; i <= endPokemonId; i++) {
      this.getPokemonById(i).subscribe((pkm) => {
        pokemons.push(pkm);
      });
    }

    return pokemons;
  }
}
