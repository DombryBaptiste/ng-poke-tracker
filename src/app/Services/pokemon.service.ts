import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { Pokemon } from "../Entity/Pokemon";

@Injectable({
    providedIn: 'root'
})

export class PokemonService {
    private readonly generationWithNoFemaleSprite: string[] = ["generation-i", "generation-ii", "generation-iii"];
    private readonly generationWithNoTransparentSprite: string [] = ["generation-i", "generation-ii"];

    constructor(private http : HttpClient) { }

    getPokemonByGeneration(id: number): Pokemon[]
    {
        let pokemons: Pokemon[] = [];
        if(id == 1)
        {
            for(let i = 1; i <= 151; i++)
            {
                this.getPokemonById(i).subscribe((pkm) => {
                    pokemons.push(pkm);
                })
            }
        }
        if(id == 2)
        {
            for(let i = 152; i <= 251; i++)
            {
                this.getPokemonById(i).subscribe((pkm) => {
                    pokemons.push(pkm);
                })
            }
        }
        if(id == 3)
        {
            for(let i = 252; i <= 386; i++)
            {
                this.getPokemonById(i).subscribe((pkm) => {
                    pokemons.push(pkm);
                })
            }
        }
        if(id == 4)
        {
            for(let i = 387; i <= 493; i++)
            {
                this.getPokemonById(i).subscribe((pkm) => {
                    pokemons.push(pkm);
                })
            }
        }
        return pokemons;
    }

    getPokemonById(id: number) : Observable<Pokemon>
    {
        // let pokemon: Pokemon;
        // this.http.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${id}`).subscribe(
        //     pkm => {
        //         if(pkm.sprites["back-female"])
        //         pokemon.name = pkm.name;
        //     }
        // );
        return this.http.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${id}`).pipe(
            map((data: any) => ({
                id: data.id,
                height: data.height,
                name: data.name,
                maleSprite: this.getSprite(data, "male", id),
                femaleSprite: this.getSprite(data, "female", id)
            }))
        );
    }

    getGenerationById(id: number) : string
    {
        if(id >= 1 && id <= 151)
        {
            return "generation-i";
        }
        if(id >= 152 && id <= 251)
        {
            return "generation-ii";
        }
        if(id >= 252 && id <= 386)
        {
            return "generation-iii";
        }
        if(id >= 387 && id <= 493)
        {
            return "generation-iv";
        }
        if(id >= 494 && id <= 649)
        {
            return "generation-v";
        }
        if(id >= 650 && id <= 721)
        {
            return "generation-vi";
        }
        if(id >= 722 && id <= 807)
        {
            return "generation-vii";
        }
        if(id >= 810 && id <= 898)
        {
            return "generation-viii";
        }
        if(id >= 906 && id <= 1025)
        {
            return "generation-ix";
        }
        else
        {
            return "";
        }
    }

    getGameById(id: number): string
    {
        if(id >= 1 && id <= 151)
        {
            return "red-blue";
        }
        if(id >= 152 && id <= 251)
        {
            return "crystal";
        }
        if(id >= 252 && id <= 386)
        {
            return "emerald";
        }
        if(id >= 387 && id <= 493)
        {
            return "platinum";
        }
        else
        {
            return "";
        }
    }

    hasFemaleSprite(idPokemon: number): boolean
    {
        return !this.generationWithNoFemaleSprite.includes(this.getGenerationById(idPokemon));
    }
    hasGenderDiff(data: any): boolean 
    {
        return data.sprites.back_female != null;
    }
    hasTransparentSprite(idPokemon: number): boolean
    {
        return !this.generationWithNoTransparentSprite.includes(this.getGenerationById(idPokemon));
    }

    getSprite(data: any, genre: string, idPokemon: number)
    {
        if(genre == "male")
        {
            if(this.hasTransparentSprite(idPokemon))
            {
                return data.sprites.versions[this.getGenerationById(idPokemon)][this.getGameById(idPokemon)].front_default;
            }
            else
            {
                return data.sprites.versions[this.getGenerationById(idPokemon)][this.getGameById(idPokemon)].front_transparent;
            }
            
        }
        if(genre == "female") {
            if(this.hasFemaleSprite(idPokemon))
            {
                return data.sprites.versions[this.getGenerationById(idPokemon)][this.getGameById(idPokemon)].front_female
            }
            if(this.hasGenderDiff(data))
            {
                if(this.hasTransparentSprite(idPokemon))
                {
                    return data.sprites.versions[this.getGenerationById(idPokemon)][this.getGameById(idPokemon)].front_default;
                }
                else
                {
                    return data.sprites.versions[this.getGenerationById(idPokemon)][this.getGameById(idPokemon)].front_transparent;
                }
            }
        }
        else
        {
            return null;
        }
        
    }
    
}