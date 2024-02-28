import { Component } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from '@angular/material/button';
import { ListPokemonComponent } from "../list-pokemon/list-pokemon.component";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [MatTabsModule, MatIconModule, MatMenuModule, MatButtonModule, ListPokemonComponent],
  templateUrl: "navbar.component.html",
  styleUrl: "navbar.component.css",
})
export class NavbarComponent {}
