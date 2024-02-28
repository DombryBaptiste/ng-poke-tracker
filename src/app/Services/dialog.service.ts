import { Injectable } from "@angular/core";
import { MatSnackBar } from '@angular/material/snack-bar'

@Injectable({
    providedIn: 'root'
})
export class DialogService {

    constructor(private snackbar: MatSnackBar) { }

    success(message: string)
    {
        this.snackbar.open(message, undefined, {
            duration: 3000,
            verticalPosition: "top",
            panelClass: ['green-snackbar']
        })
    }

    error(message: string)
    {
        this.snackbar.open(message, undefined, {
            duration: 3000,
            verticalPosition: "top",
            panelClass: ['mdc-snackbar', 'red-snackbar']
        })
    }
}