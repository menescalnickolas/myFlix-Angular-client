
import { Component, OnInit } from '@angular/core';
import { UserRegistrationService } from '../fetch-api-data.service'
import { ProfileViewComponent } from '../profile-view/profile-view.component';
import { MatDialog } from '@angular/material/dialog';
import { MovieDetailsDialogComponent } from '../movie-details-dialog/movie-details-dialog.component';


@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})

export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  constructor(
    public fetchApiData: UserRegistrationService,
    public dialog: MatDialog
  ) { }

ngOnInit(): void {
  this.getAllMovies();
}

getAllMovies(): void {
  this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log('Movies loaded: ' + this.movies);

      // Log the titles of all movies
      this.movies.forEach(movie => {
        console.log('Movie Title:', movie.Title);
      });
      return this.movies;
    });
  }

  openProfileViewDialog(): void {
      this.dialog.open(ProfileViewComponent, {
        width: '280px'
      });
    }

    openDetailsDialog(movie: any): void {
      this.dialog.open(MovieDetailsDialogComponent, {
        width: '900px',
        data: {
          title: movie.Title || 'Untitled Movie',
          year: movie.Year,
          genre: movie.Genre?.Name || 'Unknown Genre',
          genreDescription: movie.Genre?.Description || 'No description available',
          director: movie.Director?.Name || 'Unknown Director',
          directorBio: movie.Director?.Bio || 'No bio available',
          synopsis: movie.Synopsis || 'No synopsis available'
        },
      });
    }

}