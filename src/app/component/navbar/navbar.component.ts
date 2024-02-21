import { Component, Input } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs'
import { MatIconModule } from '@angular/material/icon'
import { ListPokemonComponent } from '../list-pokemon/list-pokemon.component';
import { UserData } from '../../Entity/UserData';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatTabsModule, MatIconModule, ListPokemonComponent],
  templateUrl: "navbar.component.html",
  styleUrl: "navbar.component.css",
})
export class NavbarComponent {
  @Input() user: UserData;

}
