import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, catchError, forkJoin, map, of } from "rxjs";
import { Pokemon } from "../Entity/Pokemon";
import { LocalStorageService } from "./localStorage.service";
import { Gender } from "../Enum/Gender";
import { IPokemonService } from "../interface/pokemon.service.interface";

@Injectable({
  providedIn: "root",
})
export class PokemonService implements IPokemonService {
  private readonly pokemonIdInGen8_9 = [810, 1025];
  private readonly InitPokemonRange = {
    startId: 1,
    endId: 649,
  };
  private readonly generationBounds: number[] = [
    151, 251, 386, 493, 649, 721, 807, 898, 1025,
  ];
  private readonly generationLabels: string[] = [
    "generation-i",
    "generation-ii",
    "generation-iii",
    "generation-iv",
    "generation-v",
    "generation-vi",
    "generation-vii",
    "generation-viii",
    "generation-ix",
  ];
  private readonly gameLabels: string[] = [
    "red-blue",
    "crystal",
    "emerald",
    "platinum",
    "black-white",
    "x-y",
    "ultra-sun-ultra-moon",
  ];
  private readonly GenerationRange: { [key: number]: number[] } = {
    1: [1, 151],
    2: [152, 251],
    3: [252, 386],
    4: [387, 493],
    5: [494, 649],
    6: [650, 721],
    7: [722, 809],
    8: [810, 905],
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
  private readonly pikachu_capId: number[] = [
    10094, 10095, 10096, 10097, 10098, 10099, 10148, 10160,
  ];
  private readonly gen3FormsId: number[] = [10001, 10002, 10003];
  private readonly gen4FormsId: number[] = [
    10034, 10035, 10004, 10005, 10039, 10040, 10008, 10009, 10010, 10011, 10012,
    10006,
  ];
  private readonly gen4FormExclusionId: number[] = [10034, 10035, 10039, 10040];
  private readonly gen5FormsId: number[] = [
    10068, 10069, 10070, 10071, 10072, 10073, 10016, 10019, 10020, 10021, 10024,
  ];
  private readonly gen5FormsExclusionId: number[] = [
    10068, 10069, 10070, 10071, 10072, 10073,
  ];

  private readonly alternateListId: number[] = this.pikachu_capId.concat(
    this.gen3FormsId,
    this.gen4FormsId,
    this.gen5FormsId
  );

  private readonly alternateExclusionListId: number[] =
    this.gen4FormExclusionId.concat(this.gen5FormsExclusionId);

  private readonly generationAlternate: { [key: number]: number[] } = {
    1: this.pikachu_capId,
    2: [],
    3: this.gen3FormsId,
    4: this.gen4FormsId,
    5: this.gen5FormsId,
    6: [],
    7: [],
    8: [],
    9: [],
  };

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
          }))
        );
    } else if (gender == Gender.Female) {
      return this.http
        .get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
        .pipe(
          map((data: any) => ({
            id: data.id,
            name: data.name,
            gender: gender,
            sprite: this.getFemaleSprite(data, pokemonId),
            addedDate: null,
            count: 0,
          }))
        );
    } else {
      let request = "https://pokeapi.co/api/v2/";
      if (this.alternateExclusionListId.includes(pokemonId)) {
        request += "pokemon-form/" + pokemonId;
      } else {
        request += "pokemon/" + pokemonId;
      }
      return this.http.get<Pokemon>(request).pipe(
        map((data: any) => ({
          id: data.id,
          name: data.name,
          gender: gender,
          sprite: this.getAlternateSprite(data, pokemonId),
          addedDate: null,
          count: 0,
        }))
      );
    }
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
        if (pokemon.id >= startPokemonId && pokemon.id <= endPokemonId) {
          pokemons.push(pokemon);
        }
      } else {
        let a = this.generationAlternate[id];
        if (a.includes(pokemon.id)) {
          pokemons.push(pokemon);
        }
      }
    });
    return pokemons;
  }

  getGenerationById(id: number): string {
    return id >= 1 && id <= 151
      ? "generation-i"
      : id >= 152 && id <= 251
      ? "generation-ii"
      : id >= 252 && id <= 386
      ? "generation-iii"
      : id >= 387 && id <= 493
      ? "generation-iv"
      : id >= 494 && id <= 649
      ? "generation-v"
      : id >= 650 && id <= 721
      ? "generation-vi"
      : id >= 722 && id <= 807
      ? "generation-vii"
      : id >= 810 && id <= 898
      ? "generation-viii"
      : id >= 906 && id <= 1025
      ? "generation-ix"
      : "generation not found";
  }

  getGameById(id: number): string {
    return id >= 1 && id <= 151
      ? "red-blue"
      : id >= 152 && id <= 251
      ? "crystal"
      : id >= 252 && id <= 386
      ? "emerald"
      : id >= 387 && id <= 493
      ? "platinum"
      : id >= 494 && id <= 649
      ? "black-white"
      : id >= 650 && id <= 721
      ? "x-y"
      : id >= 722 && id <= 807
      ? "ultra-sun-ultra-moon"
      : "game not found";
  }

  hasFemaleSprite(idPokemon: number): boolean {
    return !this.generationWithNoFemaleSprite.includes(
      this.getGenerationById(idPokemon)
    );
  }

  hasFrontFemaleSprite(data: any, generation: string, game: string): boolean {
    return data.sprites.versions[generation][game].front_female != null;
  }

  hasGenderDiff(data: any): boolean {
    return data.sprites.back_female != null;
  }

  hasTransparentSprite(idPokemon: number): boolean {
    return !this.generationWithNoTransparentSprite.includes(
      this.getGenerationById(idPokemon)
    );
  }

  getMaleSprite(data: any, idPokemon: number): string {
    if (this.hasOlderSprite(idPokemon)) {
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
    const generation = this.getGenerationById(idPokemon);
    const game = this.getGameById(idPokemon);

    const sprites = data.sprites.versions[generation][game];
    const hasFemaleSprite = this.hasFemaleSprite(idPokemon);
    const hasGenderDiff = this.hasGenderDiff(data);

    if (
      hasFemaleSprite &&
      hasGenderDiff &&
      this.hasFrontFemaleSprite(data, generation, game)
    ) {
      return sprites.front_female ?? sprites.front_default;
    }

    if (hasGenderDiff) {
      const spriteType = this.hasTransparentSprite(idPokemon)
        ? "front_default"
        : "front_transparent";
      return sprites[spriteType];
    }

    return null;
  }

  getAlternateSprite(data: any, idPokemon: number) {
    if (this.alternateExclusionListId.includes(idPokemon)) {
      return data.sprites.front_default;
    }
    return data.sprites.other.home.front_default;
  }

  hasOlderSprite(idPokemon: number): boolean {
    if (
      idPokemon >= this.pokemonIdInGen8_9[0] &&
      idPokemon <= this.pokemonIdInGen8_9[1]
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

    if (listAllMalePokemon == null) {
      observables.push(
        this.getAllPokemon(Gender.Male).pipe(
          map((pokemons) => {
            console.log(pokemons);
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
            console.log(pokemons);
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
            console.log(pokemons);
            this.localstorageService.saveData(
              "ListAllAlternatePokemon",
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
    let startPokemonId: number = this.InitPokemonRange.startId;
    let endPokemonId: number = this.InitPokemonRange.endId;

    let observables: Observable<Pokemon>[] = [];
    if (gender != Gender.Alternate) {
      for (let i = startPokemonId; i <= endPokemonId; i++) {
        observables.push(this.getPokemonById(i, gender));
      }
    } else {
      this.alternateListId.forEach((id) => {
        observables.push(this.getPokemonById(id, gender));
      });
    }

    return forkJoin(observables).pipe(
      map((pokemonArray: Pokemon[]) =>
        pokemonArray.filter((pokemon) => pokemon.sprite !== null)
      )
    );
  }
}
