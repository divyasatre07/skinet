import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService { 
  private snackbar = inject(MatSnackBar);
  
  // Show an error snackbar (red style)
  error(message: string): void {
    this.snackbar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['snack-error'], // CSS class for styling
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  // Show a success snackbar (green style)
  success(message: string): void {
    this.snackbar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['snack-success'], // CSS class for styling
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
