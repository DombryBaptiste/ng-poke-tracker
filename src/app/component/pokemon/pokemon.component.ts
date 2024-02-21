import { Component, Input } from '@angular/core';
import { Pokemon } from '../../Entity/Pokemon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon',
  standalone: true,
  imports: [CommonModule],
  templateUrl:"pokemon.component.html",
  styleUrl: "pokemon.component.css"
})
export class PokemonComponent {
  @Input() pokemon: Pokemon
}
