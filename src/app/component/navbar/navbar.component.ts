import { Component } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from '@angular/material/button';
import { ListPokemonComponent } from "../list-pokemon/list-pokemon.component";
import { PokemonOwnedService } from "../../Services/pokemonOwned.service";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [MatTabsModule, MatIconModule, MatMenuModule, MatButtonModule, ListPokemonComponent],
  templateUrl: "navbar.component.html",
  styleUrl: "navbar.component.css",
})
export class NavbarComponent {
  constructor(private pokemonOwnedService: PokemonOwnedService) { }

  exportSave()
  {
    this.pokemonOwnedService.downloadPokemonOwnedAsJSON();
  }

  importSave(event: any) : void
  {
    const selectedFile = event.target.files[0];
    console.log(selectedFile.type);
    if (selectedFile && selectedFile.type == "application/json") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = reader.result as string;
        this.pokemonOwnedService.updatePokemonsOwned(JSON.parse(fileContent));
      };
      reader.readAsText(selectedFile);
    }
  }
}
