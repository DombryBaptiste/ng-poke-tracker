import { Component, Inject, Input, input } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [],
  templateUrl: "snackbar.component.html",
  styleUrl: "snackbar.component.css"
})
export class SnackbarComponent {
  @Input() message: string;
  @Input() color: string;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}
}
