import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Represents the MovieDetailsDialogComponent, which displays details of a selected movie.
 * 
 * @component
 */

@Component({
  selector: 'app-movie-details-dialog',
  templateUrl: './movie-details-dialog.component.html',
})
export class MovieDetailsDialogComponent {

  /**
   * Creates an instance of the MovieDetailsDialogComponent.
   * 
   * @param {any} data - The data passed into the dialog, typically the movie details.
   */
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
