import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs'
import { MatIconModule } from '@angular/material/icon'
import { ListPokemonComponent } from '../list-pokemon/list-pokemon.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatTabsModule, MatIconModule, ListPokemonComponent],
  templateUrl: "navbar.component.html",
  styleUrl: "navbar.component.css",
})
export class NavbarComponent{

}
