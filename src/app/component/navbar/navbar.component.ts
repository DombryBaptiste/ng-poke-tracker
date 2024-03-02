import { Component, OnInit } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { ListPokemonComponent } from "../list-pokemon/list-pokemon.component";
import { PokemonOwnedService } from "../../Services/pokemonOwned.service";
import { DialogService } from "../../Services/dialog.service";
import { PokemonService } from "../../Services/pokemon.service";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [
    MatTabsModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    ListPokemonComponent,
  ],
  templateUrl: "navbar.component.html",
  styleUrl: "navbar.component.css",
})
export class NavbarComponent implements OnInit {
  ownPokemon: number = 0;

  constructor(
    private pokemonOwnedService: PokemonOwnedService,
    private dialogService: DialogService,
    private pokemonService: PokemonService,
  ) {}

  ngOnInit(): void {
    this.ownPokemon = this.pokemonOwnedService.getNumberPokemonOwned();
    this.pokemonOwnedService.pokemonsOwned$.subscribe((pokemons) => {
      this.ownPokemon = pokemons.length;
    });
  }

  exportSave() {
    this.pokemonOwnedService.downloadPokemonOwnedAsJSON();
  }

  importSave(event: any): void {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type == "application/json") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = reader.result as string;
        this.pokemonOwnedService.updatePokemonsOwned(JSON.parse(fileContent));
        this.dialogService.success("The file was successfully uploaded");
      };
      reader.readAsText(selectedFile);
    } else {
      this.dialogService.error("The file could not be read");
    }
  }
}
