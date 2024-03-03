import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, forkJoin, map, of, switchMap } from "rxjs";
import { Pokemon } from "../Entity/Pokemon";
import { LocalStorageService } from "./localStorage.service";
import { Gender } from "../Enum/Gender";
import { IPokemonService } from "../interface/pokemon.service.interface";
import { PokemonSpecific } from "../Enum/PokemonSpecific";
import { PokemonFemaleJSON } from "../Entity/PokemonFemaleJSON";
import { PokemonAlternateJSON } from "../Entity/PokemonAlternateJSON";
import { FormEnum } from "../Enum/FormEnum";
import { NumberValueAccessor } from "@angular/forms";

@Injectable({
  providedIn: "root",
})
export class PokemonService implements IPokemonService {
  private readonly pokemonIdInGen8_9 = [808, 1025];
  private readonly InitPokemonRange = {
    startId: 1,
    endId: 1025,
  };
  private readonly GenerationRange: { [key: number]: number[] } = {
    1: [1, 151],
    2: [152, 251],
    3: [252, 386],
    4: [387, 493],
    5: [494, 649],
    6: [650, 721],
    7: [722, 807],
    8: [810, 898],
    81: [899, 905],
    9: [906, 1025],
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

  constructor(
    private http: HttpClient,
    private localstorageService: LocalStorageService
  ) {}

  getPokemonById(pokemonId: number, gender: Gender): Observable<Pokemon> {
    if (gender == Gender.Male) {
      return this.http
        .get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
        .pipe(
          map((data: any) => ({
            id: data.id,
            name: data.name,
            gender: gender,
            sprite: this.getMaleSprite(data, pokemonId),
            addedDate: null,
            count: 0,
            form: FormEnum.Pokemon,
          }))
        );
    } /*if (gender == Gender.Female)*/ else {
      return this.http
        .get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
        .pipe(
          map((data: any) => ({
            id: data.id,
            name: data.name.includes("meowstic-male")
              ? "meowstic-female"
              : data.name,
            gender: gender,
            sprite: this.getFemaleSprite(data, pokemonId),
            addedDate: null,
            count: 0,
            form: FormEnum.Pokemon,
          }))
        );
    }
    // } else {
    //   let request = "https://pokeapi.co/api/v2/";
    //   if (this.alternateExclusionListId.includes(pokemonId)) {
    //     request += "pokemon-form/" + pokemonId;
    //   } else {
    //     request += "pokemon/" + pokemonId;
    //   }
    //   return this.http.get<Pokemon>(request).pipe(
    //     map((data: any) => ({
    //       id: data.id,
    //       name: data.name,
    //       gender: gender,
    //       sprite: this.getAlternateSprite(data, pokemonId),
    //       addedDate: null,
    //       count: 0,
    //     }))
    //   );
    // }
  }

  getPokemonsByGeneration(id: number, gender: Gender): Pokemon[] {
    let pokemonLocal;
    if (gender == Gender.Male) {
      pokemonLocal = this.localstorageService.getData("ListAllMalePokemon");
    } else if (gender == Gender.Female) {
      pokemonLocal = this.localstorageService.getData("ListAllFemalePokemon");
    } else {
      pokemonLocal = this.localstorageService.getData(
        "ListAllAlternatePokemon"
      );
    }
    let pokemonList: Pokemon[] = [];
    if (pokemonLocal) {
      pokemonList = JSON.parse(pokemonLocal).slice(0);
    }

    let pokemons: Pokemon[] = [];
    let startPokemonId = this.GenerationRange[id][0];
    let endPokemonId = this.GenerationRange[id][1];

    pokemonList.forEach((pokemon) => {
      if (gender == Gender.Male || gender == Gender.Female) {
        if (id == 8 && pokemon.id == 10186) {
          pokemons.push(pokemon);
        } else if (id == 9 && pokemon.id == 10254) {
          pokemons.push(pokemon);
        } else {
          if (pokemon.id >= startPokemonId && pokemon.id <= endPokemonId) {
            pokemons.push(pokemon);
          }
        }
      } else {
        //this.getPokemonAlternateByGenerationId(id).subscribe()
        // this.http.get<PokemonAlternateJSON[]>('assets/data/alternatePokemons.json')
        // let pokemonsAlternate = this.pokemonsAlternate.filter(
        //   (t) => t.gen == id
        // );
        // if (
        //   pokemonsAlternate.some(
        //     (pokemonAlternate) => pokemonAlternate.id === pokemon.id && !pokemon.name.includes("vivillon")
        //   )
        // ) {
        //   pokemons.push(pokemon);
        // }
      }
    });
    return pokemons;
  }

  getPokemonAlternateByGenerationId(
    id: number,
    gender: Gender
  ): Observable<Pokemon[]> {
    let pokemonLocal: string | null;
    let file: string;
    if (gender == Gender.Alternate) {
      pokemonLocal = this.localstorageService.getData(
        "ListAllAlternatePokemon"
      );
      file = "assets/data/alternatePokemons.json";
    } else {
      pokemonLocal = this.localstorageService.getData("ListAllRegionalForm");
      file = "assets/data/regionForm.json";
    }
    let pokemonList: Pokemon[] = [];
    if (pokemonLocal) {
      pokemonList = JSON.parse(pokemonLocal).slice(0);
    }
    return this.http.get<PokemonAlternateJSON[]>(file).pipe(
      map((pokemonAlternate: PokemonAlternateJSON[]) => {
        const pokemonFiltered = pokemonAlternate.filter(
          (pokemon) => pokemon.gen === id
        );
        let pokemons: Pokemon[] = [];

        pokemonList.forEach((pkm: Pokemon) => {
          if (
            pokemonFiltered.some(
              (pokemonAlternate) =>
                pokemonAlternate.id === pkm.id &&
                pokemonAlternate.form == pkm.form
            )
          ) {
            pokemons.push(pkm);
          }
        });
        return pokemons;
      })
    );
  }

  getGenerationById(id: number): string {
    return id >= 1 && id <= 151
      ? "generation-i"
      : id >= 152 && id <= 251
      ? "generation-ii"
      : (id >= 252 && id <= 386) || (id >= 10001 && id <= 10003)
      ? "generation-iii"
      : (id >= 387 && id <= 493) ||
        (id >= 10004 && id <= 10006) ||
        (id >= 10008 && id <= 10012)
      ? "generation-iv"
      : (id >= 494 && id <= 649) ||
        id == 10016 ||
        (id >= 10019 && id <= 10021) ||
        id == 10024
      ? "generation-v"
      : (id >= 650 && id <= 721) ||
        id == 10116 ||
        (id >= 10027 && id <= 10032) ||
        (id >= 10118 && id <= 10120) ||
        id == 10086
      ? "generation-vi"
      : (id >= 722 && id <= 807) ||
        (id >= 10123 && id <= 10126) ||
        id == 10151 ||
        id == 10152 ||
        (id >= 10137 && id <= 10142) ||
        id == 10147 ||
        id == 10091 ||
        id == 10092 ||
        (id >= 10100 && id <= 10115)
      ? "generation-vii"
      : (id >= 810 && id <= 898) || id == 10186
      ? "generation-viii"
      : (id >= 906 && id <= 1025) || id == 10254
      ? "generation-ix"
      : "generation not found";
  }

  getGameById(id: number): string {
    return id >= 1 && id <= 151
      ? "red-blue"
      : id >= 152 && id <= 251
      ? "crystal"
      : (id >= 252 && id <= 386) || id == 10003
      ? "emerald"
      : (id >= 387 && id <= 493) ||
        (id >= 10004 && id <= 10006) ||
        (id >= 10008 && id <= 10012)
      ? "platinum"
      : (id >= 494 && id <= 649) ||
        id == 10016 ||
        (id >= 10019 && id <= 10021) ||
        id == 10024
      ? "black-white"
      : (id >= 650 && id <= 721) ||
        id == 10116 ||
        (id >= 10027 && id <= 10032) ||
        (id >= 10118 && id <= 10120) ||
        id == 10086
      ? "x-y"
      : (id >= 722 && id <= 807) ||
        (id >= 10123 && id <= 10126) ||
        id == 10151 ||
        id == 10152 ||
        (id >= 10137 && id <= 10142) ||
        id == 10147 ||
        id == 10091 ||
        id == 10092 ||
        (id >= 10100 && id <= 10115)
      ? "ultra-sun-ultra-moon"
      : id == 10001 || id == 10002
      ? "firered-leafgreen"
      : "game not found";
  }

  hasFemaleSprite(idPokemon: number): boolean {
    return !this.generationWithNoFemaleSprite.includes(
      this.getGenerationById(idPokemon)
    );
  }

  hasFrontFemaleSprite(data: any, generation: string, game: string): boolean {
    if (generation == "generation-viii" || generation == "generation-ix") {
      return false;
    }
    return data.sprites.versions[generation][game].front_female != null;
  }

  hasGenderDiff(data: any): boolean {
    return data.sprites.back_female != null || data.sprites.front_female;
  }

  hasTransparentSprite(idPokemon: number): boolean {
    return !this.generationWithNoTransparentSprite.includes(
      this.getGenerationById(idPokemon)
    );
  }
  Under6G(idPokemon: number) {
    if (idPokemon <= 649 || (idPokemon >= 10001 && idPokemon <= 10024)) {
      return true;
    }
    return false;
  }

  getMaleSprite(data: any, idPokemon: number): string {
    if (this.Under6G(idPokemon)) {
      if (this.hasTransparentSprite(idPokemon)) {
        return data.sprites.versions[this.getGenerationById(idPokemon)][
          this.getGameById(idPokemon)
        ].front_default;
      } else {
        return data.sprites.versions[this.getGenerationById(idPokemon)][
          this.getGameById(idPokemon)
        ].front_transparent;
      }
    } else {
      return data.sprites.front_default;
    }
  }

  getFemaleSprite(data: any, idPokemon: number) {
    if (this.Under6G(idPokemon)) {
      if (this.hasFemaleSprite(idPokemon)) {
        if (
          data.sprites.versions[this.getGenerationById(idPokemon)][
            this.getGameById(idPokemon)
          ].front_female
        ) {
          return data.sprites.versions[this.getGenerationById(idPokemon)][
            this.getGameById(idPokemon)
          ].front_female;
        } else {
          return data.sprites.versions[this.getGenerationById(idPokemon)][
            this.getGameById(idPokemon)
          ].front_default;
        }
      } else {
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
      if (data.sprites.front_female) {
        return data.sprites.front_female;
      } else {
        return data.sprites.front_default;
      }
    }
    // const generation = this.getGenerationById(idPokemon);
    // const game = this.getGameById(idPokemon);
    // let sprites;

    // if(generation == "generation-viii" || generation == "generation-ix")
    // {
    //   if(data.sprites.front_female){
    //     sprites = data.sprites.front_female;
    //   } else {
    //     sprites = data.sprites.front_default;
    //   }
    // } else {
    //   sprites = data.sprites.versions[generation][game];
    // }

    // const hasFemaleSprite = this.hasFemaleSprite(idPokemon);
    // const hasGenderDiff = this.hasGenderDiff(data);

    // if (
    //   hasFemaleSprite &&
    //   hasGenderDiff &&
    //   this.hasFrontFemaleSprite(data, generation, game)
    // ) {
    //   return sprites.front_female ?? sprites.front_default;
    // }

    // if (hasGenderDiff) {
    //   const spriteType = this.hasTransparentSprite(idPokemon)
    //     ? "front_default"
    //     : "front_transparent";
    //   return sprites[spriteType];
    // }

    // return sprites;
  }

  getAlternateSprite(data: any, pokemon: PokemonAlternateJSON) {
    if (pokemon.form == FormEnum.Form || this.isPikachuCap(pokemon.id)) {
      if (pokemon.id == 10160) {
        return data.sprites.other.home.front_default;
      }
      return data.sprites.front_default;
    }
    if (this.hasNoSpriteInHisGeneration(pokemon.id)) {
      return data.sprites.front_default;
    }

    return this.getMaleSprite(data, pokemon.id);
  }

  hasNoSpriteInHisGeneration(pokemonId: number): boolean {
    let listPokemonId = [10116, 10118, 10119, 10120, 10086];
    if (listPokemonId.includes(pokemonId)) {
      return true;
    }
    return false;
  }
  isPikachuCap(pokemonId: number): boolean {
    if (
      (pokemonId >= 10094 && pokemonId <= 10099) ||
      pokemonId == 10148 ||
      pokemonId == 10160
    ) {
      return true;
    }
    return false;
  }

  hasOlderSprite(idPokemon: number): boolean {
    if (
      (idPokemon >= this.pokemonIdInGen8_9[0] &&
        idPokemon <= this.pokemonIdInGen8_9[1]) ||
      idPokemon >= 10161 ||
      (idPokemon >= 650 && idPokemon <= 721)
    ) {
      return false;
    }
    return true;
  }

  initPokemonLocalStorage() {
    const initCompleteSubject = new Subject<void>();
    const observables: Observable<any>[] = [];

    const listAllMalePokemon =
      this.localstorageService.getData("ListAllMalePokemon");
    const pokemonOwned = this.localstorageService.getData("pokemonOwned");
    const listAllFemalePokemon = this.localstorageService.getData(
      "ListAllFemalePokemon"
    );
    const listAllAlternatePokemon = this.localstorageService.getData(
      "ListAllAlternatePokemon"
    );
    const listPikachuCap =
      this.localstorageService.getData("ListAllPikachuCap");
    const listUnown = this.localstorageService.getData("ListAllUnown");
    const listVivillon = this.localstorageService.getData("ListAllVivillon");
    const listAllRegionalForms = this.localstorageService.getData(
      "ListAllRegionalForm"
    );
    const listAllGigantamax =
      this.localstorageService.getData("ListAllGigantamax");

    if (listAllMalePokemon == null) {
      observables.push(
        this.getAllPokemon(Gender.Male).pipe(
          map((pokemons) => {
            this.localstorageService.saveData(
              "ListAllMalePokemon",
              JSON.stringify(pokemons)
            );
          })
        )
      );
    }
    if (pokemonOwned == null) {
      observables.push(
        of(this.localstorageService.saveData("pokemonOwned", ""))
      );
    }
    if (listAllFemalePokemon == null) {
      observables.push(
        this.getAllPokemon(Gender.Female).pipe(
          map((pokemons) => {
            this.localstorageService.saveData(
              "ListAllFemalePokemon",
              JSON.stringify(pokemons)
            );
          })
        )
      );
    }
    if (listAllAlternatePokemon == null) {
      observables.push(
        this.getAllPokemon(Gender.Alternate).pipe(
          map((pokemons) => {
            this.localstorageService.saveData(
              "ListAllAlternatePokemon",
              JSON.stringify(pokemons)
            );
          })
        )
      );
    }
    if (listAllRegionalForms == null) {
      observables.push(
        this.getAllPokemon(Gender.Regional).pipe(
          map((pokemons) => {
            this.localstorageService.saveData(
              "ListAllRegionalForm",
              JSON.stringify(pokemons)
            );
          })
        )
      );
    }
    if (listVivillon == null) {
      observables.push(
        this.getAllPokemonSpecific(PokemonSpecific.Vivillon).pipe(
          map((pokemons) => {
            this.localstorageService.saveData(
              "ListAllVivillon",
              JSON.stringify(pokemons)
            );
          })
        )
      );
    }
    if (listPikachuCap == null) {
      observables.push(
        this.getAllPokemonSpecific(PokemonSpecific.PikachuCap).pipe(
          map((pokemons) => {
            this.localstorageService.saveData(
              "ListAllPikachuCap",
              JSON.stringify(pokemons)
            );
          })
        )
      );
    }
    if (listUnown == null) {
      observables.push(
        this.getAllPokemonSpecific(PokemonSpecific.Unown).pipe(
          map((pokemons) => {
            this.localstorageService.saveData(
              "ListAllUnown",
              JSON.stringify(pokemons)
            );
          })
        )
      );
    }
    if (listAllGigantamax == null) {
      observables.push(
        this.getAllPokemonSpecific(PokemonSpecific.Gigantamax).pipe(
          map((pokemons) => {
            this.localstorageService.saveData(
              "ListAllGigantamax",
              JSON.stringify(pokemons)
            );
          })
        )
      );
    }

    forkJoin(observables).subscribe(() => {
      initCompleteSubject.next();
      initCompleteSubject.complete();
    });

    return initCompleteSubject.asObservable();
  }

  getAllPokemon(gender: Gender): Observable<Pokemon[]> {
    let observables: Observable<Pokemon>[] = [];

    if (gender == Gender.Male) {
      let startPokemonId: number = this.InitPokemonRange.startId;
      let endPokemonId: number = this.InitPokemonRange.endId;
      for (let i = startPokemonId; i <= endPokemonId; i++) {
        observables.push(this.getPokemonById(i, gender));
      }
      return forkJoin(observables).pipe(
        map((pokemonArray: Pokemon[]) =>
          pokemonArray.filter((pokemon) => pokemon.sprite !== null)
        )
      );
    } else if (gender == Gender.Female) {
      return this.http
        .get<PokemonFemaleJSON[]>("assets/data/femalePokemons.json")
        .pipe(
          switchMap((data: PokemonFemaleJSON[]) => {
            const femaleObservables = data.map((pokemon) =>
              this.getPokemonById(pokemon.id, gender)
            );
            observables.push(...femaleObservables);
            return forkJoin(observables);
          })
        );
    } else if (gender == Gender.Alternate) {
      return this.http
        .get<PokemonAlternateJSON[]>("assets/data/alternatePokemons.json")
        .pipe(
          switchMap((data: PokemonAlternateJSON[]) => {
            const alternateObservables = data.map((pokemon) =>
              this.getPokemonByIdAlternate(pokemon, gender)
            );
            observables.push(...alternateObservables);
            return forkJoin(observables);
          })
        );
    } else {
      return this.http
        .get<PokemonAlternateJSON[]>("assets/data/regionForm.json")
        .pipe(
          switchMap((data: PokemonAlternateJSON[]) => {
            const alternateObservables = data.map((pokemon) =>
              this.getPokemonByIdAlternate(pokemon, gender)
            );
            observables.push(...alternateObservables);
            return forkJoin(observables);
          })
        );
    }
  }

  getAllPokemonSpecific(pokemon: PokemonSpecific): Observable<Pokemon[]> {
    let pokemons: Pokemon[] = [];
    let observables: Observable<Pokemon>[] = [];
    if (pokemon == PokemonSpecific.Vivillon) {
      return this.http
        .get<PokemonAlternateJSON[]>("assets/data/vivillon.json")
        .pipe(
          switchMap((data: PokemonAlternateJSON[]) => {
            const alternateObservables = data.map((pokemon) =>
              this.getPokemonByIdAlternate(pokemon, Gender.Alternate)
            );
            observables.push(...alternateObservables);
            return forkJoin(observables);
          })
        );
    } else if (pokemon == PokemonSpecific.PikachuCap) {
      return this.http
        .get<PokemonAlternateJSON[]>("assets/data/pikachuCap.json")
        .pipe(
          switchMap((data: PokemonAlternateJSON[]) => {
            const alternateObservables = data.map((pokemon) =>
              this.getPokemonByIdAlternate(pokemon, Gender.Alternate)
            );
            observables.push(...alternateObservables);
            return forkJoin(observables);
          })
        );
    } else if (pokemon == PokemonSpecific.Unown) {
      return this.http
        .get<PokemonAlternateJSON[]>("assets/data/unown.json")
        .pipe(
          switchMap((data: PokemonAlternateJSON[]) => {
            const alternateObservables = data.map((pokemon) =>
              this.getPokemonByIdAlternate(pokemon, Gender.Alternate)
            );
            observables.push(...alternateObservables);
            return forkJoin(observables);
          })
        );
    } else if (pokemon == PokemonSpecific.Gigantamax) {
      return this.http
        .get<PokemonAlternateJSON[]>("assets/data/gigantamax.json")
        .pipe(
          switchMap((data: PokemonAlternateJSON[]) => {
            const alternateObservables = data.map((pokemon) =>
              this.getPokemonByIdAlternate(pokemon, Gender.Alternate)
            );
            observables.push(...alternateObservables);
            return forkJoin(observables);
          })
        );
    }

    return forkJoin(observables).pipe(
      map((pokemonArray: Pokemon[]) =>
        pokemonArray.filter((pokemon) => pokemon.sprite !== null)
      )
    );
  }

  getPokemonByIdAlternate(
    pokemon: PokemonAlternateJSON,
    gender: Gender
  ): Observable<Pokemon> {
    let request = "https://pokeapi.co/api/v2/";
    if (pokemon.form == FormEnum.Form) {
      request += "pokemon-form/" + pokemon.id;
    } else {
      request += "pokemon/" + pokemon.id;
    }
    return this.http.get<Pokemon>(request).pipe(
      map((data: any) => ({
        id: data.id,
        name: data.name,
        gender: gender,
        sprite: this.getAlternateSprite(data, pokemon),
        addedDate: null,
        count: 0,
        form: pokemon.form,
      }))
    );
  }

  getSpecificPokemon(pokemon: PokemonSpecific): Pokemon[] {
    let pokemonLocal;
    if (pokemon == PokemonSpecific.PikachuCap) {
      pokemonLocal = this.localstorageService.getData("ListAllPikachuCap");
    } else if (pokemon == PokemonSpecific.Unown) {
      pokemonLocal = this.localstorageService.getData("ListAllUnown");
    } else if (pokemon == PokemonSpecific.Vivillon) {
      pokemonLocal = this.localstorageService.getData("ListAllVivillon");
    } else if (pokemon == PokemonSpecific.Gigantamax) {
      pokemonLocal = this.localstorageService.getData("ListAllGigantamax");
    }
    // Hisui and form
    else {
      pokemonLocal = this.localstorageService.getData("ListAllMalePokemon");
    }

    let pokemonList: Pokemon[] = [];
    if (pokemonLocal) {
      pokemonList = JSON.parse(pokemonLocal).slice(0);
      if (pokemon == PokemonSpecific.UnknownRegion) {
        pokemonList = pokemonList.filter(
          (pokemon) => pokemon.id == 808 || pokemon.id == 809
        );
      }
      if (pokemon == PokemonSpecific.Hisui) {
        pokemonList = pokemonList.filter(
          (pokemon) => pokemon.id >= 899 && pokemon.id <= 905
        );
      }
    }

    let pokemons: Pokemon[] = [];

    pokemonList.forEach((pokemon) => {
      pokemons.push(pokemon);
    });
    return pokemons;
  }
}
