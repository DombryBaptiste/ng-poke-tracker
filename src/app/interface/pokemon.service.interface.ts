import { Observable } from "rxjs";
import { Gender } from "../Enum/Gender";
import { Pokemon } from "../Entity/Pokemon";

export interface IPokemonService {
  /**
   * Retrieves information about a Pokémon from the PokeAPI.
   * @param idPokemon The National Dex ID of the Pokémon.
   * @param gender The gender of the Pokémon (Male or Female).
   * @returns Observable containing the Pokémon information.
   * @example
   * ```typescript
   * this.pokemonService.getPokemonById(25, Gender.Male).subscribe(pokemon => {
   *   console.log(pokemon);
   * });
   * {
   *   "id": 25,
   *   "name": "pikachu",
   *   "gender": 1,
   *   "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/transparent/25.png"
   * }
   * ```
   */
  getPokemonById(pokemonId: number, gender: Gender): Observable<Pokemon>;

  /**
   * Returns the generation associated with a Pokémon.
   * @param idPokemon The National Dex ID of the Pokémon.
   * @returns The generation where the Pokémon appeared.
   * @example
   * ```typescript
   * const generation = getGenerationById(25); // Returns "generation-i"
   * ```
   */
  getGenerationById(id: number): string;

  /**
   * Returns the game associated with a Pokémon.
   * @param idPokemon The National Dex ID of the Pokémon.
   * @returns The game where the Pokémon first appeared.
   * @example
   * ```typescript
   * const game = getGameById(25); // Returns "red-blue"
   * ```
   */
  getGameById(id: number): string;

  /**
   * Retrieves observable streams of Pokémon data for all Pokémon within the specified ID range.
   * Uses the initial Pokémon ID range defined in the service configuration (InitPokemonRange).
   * @param gender The gender of the Pokémon (Male or Female).
   * @returns An observable stream emitting an array of Pokémon data.
   */
  getAllPokemon(gender: Gender): Observable<Pokemon[]>;

  /**
   * Retrieves Pokémons data for a specific generation and gender from local storage.
   * If the necessary data is available locally, it retrieves the Pokémons data for the specified generation and gender.
   * @param id The ID of the generation for which Pokémon data is requested.
   * @param gender The gender of the Pokémon (Male, Female).
   * @returns An array of Pokémon objects representing the Pokémon of the specified generation and gender.
   */
  getPokemonsByGeneration(generationId: number, gender: Gender): Pokemon[];

  /**
   * Returns the correct male sprite of the Pokémon with the specified id in the first generation it appears.
   * @param data The response from the PokeAPI call. Example: https://pokeapi.co/api/v2/pokemon/25
   * @param idPokemon The id of the Pokémon in the National Pokédex.
   * @returns A string with a link to the correct sprite of the Pokémon.
   */
  getMaleSprite(data: any, idPokemon: number): string;

  /**
   * Checks if a Pokémon has a transparent sprite.
   * This means that the sprites.generation.X.front_default property is transparent.
   * @param idPokemon The ID of the Pokémon in the National Pokédex.
   * @returns True if the Pokémon has a transparent sprite, otherwise false.
   */
  hasTransparentSprite(idPokemon: number): boolean;

  /**
   * Checks if a Pokémon has an older sprite, meaning sprites.generation.X.front_default for example.
   * @param idPokemon The ID of the Pokémon in the national Pokédex.
   * @returns True if the Pokémon has an older sprite, otherwise false.
   */
  hasOlderSprite(idPokemon: number): boolean;

  /**
   * Checks if a Pokémon has a female sprite available.
   * This function determines whether a Pokémon has a female sprite based on its Pokédex ID.
   * If the Pokémon is from a generation known to have female sprites, it returns true; otherwise, it returns false.
   * @param idPokemon The ID of the Pokémon in the national Pokédex.
   * @returns True if the Pokémon has a female sprite available, otherwise false.
   */
  hasFemaleSprite(idPokemon: number): boolean;

  /**
   * Checks if a Pokémon sprite for the female gender exists in the given data, generation, and game.
   * @param data The Pokémon data containing sprite information.
   * @param generation The generation of the Pokémon game (e.g., "generation-i").
   * @param game The specific game version within the generation (e.g., "red-blue").
   * @returns True if a front sprite for the female gender exists, otherwise false.
   */
  hasFrontFemaleSprite(data: any, generation: string, game: string): boolean;

  /**
   * Returns the correct female sprite of the Pokémon with the specified id in the first generation it appears.
   * @param data The response from the PokeAPI call. Example: https://pokeapi.co/api/v2/pokemon/25
   * @param idPokemon The id of the Pokémon in the National Pokédex.
   * @returns A string with a link to the correct sprite of the Pokémon.
   */
  getFemaleSprite(data: any, idPokemon: number): string;

  /**
   * Checks if a Pokémon has different gender-specific sprites.
   * @param data The Pokémon data containing sprite information.
   * @returns True if the Pokémon has different gender-specific sprites (e.g., back_female sprite), otherwise false.
   */
  hasGenderDiff(data: any): boolean;

  /**
   * Initializes the local storage for Pokémon-related data.
   * This function checks if the necessary data for Pokémon storage exists in local storage.
   * If not, it retrieves the data necessary for the application to function from the server
   * and stores it locally.
   * @returns An observable that emits a void value when the initialization is complete.
   */
  initPokemonLocalStorage(): Observable<void>;
}
