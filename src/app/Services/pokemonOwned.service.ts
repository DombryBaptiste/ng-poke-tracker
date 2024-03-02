import { Injectable, OnInit } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Pokemon } from "../Entity/Pokemon";
import { LocalStorageService } from "./localStorage.service";
import { saveAs } from "file-saver";

@Injectable({
  providedIn: "root",
})
export class PokemonOwnedService {
  private pokemonsOwnedSubject: BehaviorSubject<Pokemon[]> =
    new BehaviorSubject<Pokemon[]>([]);
  public pokemonsOwned$: Observable<Pokemon[]> =
    this.pokemonsOwnedSubject.asObservable();

  constructor(public localStorageService: LocalStorageService) {
    this.initializePokemonOwnedUser();
  }

  private initializePokemonOwnedUser(): void {
    const pokemonOwnedUser = this.getPokemonOwnedLocalStorage();
    this.pokemonsOwnedSubject.next(pokemonOwnedUser);
  }

  getPokemonOwnedLocalStorage(): Pokemon[] {
    let pokemons: Pokemon[] = [];
    let pokemonOwned: string | null = this.localStorageService.getData("pokemonOwned");
    if (pokemonOwned) {
      pokemons = JSON.parse(pokemonOwned);
    }
    return pokemons;
  }

  getPokemonsOwned(): Pokemon[] {
    return this.pokemonsOwnedSubject.getValue();
  }

  updatePokemonsOwned(updatedList: Pokemon[]): void {
    this.pokemonsOwnedSubject.next(updatedList);
    localStorage.setItem("pokemonOwned", JSON.stringify(updatedList));
  }

  downloadPokemonOwnedAsJSON(): void {
    const pokemonsOwned = this.getPokemonsOwned();
    const json = JSON.stringify(pokemonsOwned);
    const blob = new Blob([json], { type: "application/json" });
    const date = new Date();
    saveAs(blob, `pokemonOwned${date.toLocaleDateString()}.json`);
  }

  getNumberPokemonOwned(): number {
    return this.pokemonsOwnedSubject.getValue().length;
  }
  
}
