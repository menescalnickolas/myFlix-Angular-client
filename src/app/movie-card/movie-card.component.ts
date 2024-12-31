
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
  favorites: string[] = []; // Array to hold favorite movie IDs
  user: any = {}; // To store user information


  constructor(
    public fetchApiData: UserRegistrationService,
    public dialog: MatDialog
  ) { }

ngOnInit(): void {
  this.getAllMovies();
  this.getUserData(); // Load the user's favorites on initialization
}

getAllMovies(): void {
  this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp.filter((movie: any) => movie._id); // Filter out movies with no ID
      console.log('Movies loaded: ' + this.movies);

      // Log the titles of all movies
      this.movies.forEach(movie => {
        console.log('Movie Title:', movie.Title, 'Movie ID:', movie._id );
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

      console.log('Opening dialog with data:', {
        title: movie.Title || 'Untitled Movie',
        year: movie.Year,
        genre: movie.Genre?.Name || 'Unknown Genre',
        genreDescription: movie.Genre?.Description || 'No description available',
        director: movie.Director?.Name || 'Unknown Director',
        directorBio: movie.Director?.Bio || 'No bio available',
        synopsis: movie.Synopsis || 'No synopsis available',
        image: movie.Image || 'No image available'  // Check if image exists
      });

      this.dialog.open(MovieDetailsDialogComponent, {
        width: '900px',
        data: {
          title: movie.Title || 'Untitled Movie',
          year: movie.Year,
          genre: movie.Genre?.Name || 'Unknown Genre',
          genreDescription: movie.Genre?.Description || 'No description available',
          director: movie.Director?.Name || 'Unknown Director',
          directorBio: movie.Director?.Bio || 'No bio available',
          synopsis: movie.Description || 'No synopsis available',
          image: movie.Image || '' 
        },
      });
    }


   getFavorites(): void {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const Username = user?.Username;

  // Ensure Username is available
  if (!Username) {
    console.error('User is not logged in.');
    return; // Exit if no Username is found
  }

  this.fetchApiData.getFavoriteMovies(Username).subscribe(
    (resp: any) => {
      if (resp && Array.isArray(resp)) {
        // Assuming resp is an array of favorite movies
        this.favorites = resp.map((movie: any) => movie._id); // Store favorite movie IDs
        console.log('Favorite movies:', this.favorites); // Log the favorite movies
      } else {
        console.error('Unexpected response format:', resp);
      }
    },
    (error) => {
      console.error('Error fetching favorite movies:', error);
    }
  );
}
    
/*
    addMovieToFavorites(movie: any): void {
    
      
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const Username = user.Username; // Fetch username from storage or another source
      
      console.log('Attempting to add movie with ID:', movie);
      
      if (!movie) {
        console.error('Movie ID is undefined!');
        return;
      }
    
      if (!Username) {
              console.error('Username is missing!');
              return;
            }

      console.log(Username);
      console.log(movie);

      this.fetchApiData.addFavoriteMovie(Username, movie).subscribe(
        (response) => {
          console.log('Movie added to favorites:', response);
          this.favorites.push(movie); // Update the favorite list
          // Optionally update the UI
        },
        (error) => {
          console.error('Error adding movie to favorites:', error);
        }
      );
    }

    */

    toggleFavorite(movie: any): void {
      console.log('Movie object:', movie._id);

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const Username = user.Username;

      if (!Username) return;

      if (this.isFavorite(movie._id)) {
        this.fetchApiData.deleteFavoriteMovie(Username, movie._id).subscribe(() => {
          this.favorites = this.favorites.filter((id) => id !== movie._id);
        });
      } else {
        this.fetchApiData.addFavoriteMovie(Username, movie._id).subscribe(() => {
          this.favorites.push(movie._id);
          console.log('Movie added to favorites');
        });
      }
    }
    
    isFavorite(movie: string): boolean {
      return this.favorites.includes(movie); // Check if movie is a favorite
    }

    getUserData(): void {
      const Username = localStorage.getItem('user');
      if (Username) {
        this.fetchApiData.getUserByID(Username).subscribe((userData: any) => {
          this.user = userData;
          this.favorites = userData.favorites || [];
        });
      }
    }

}