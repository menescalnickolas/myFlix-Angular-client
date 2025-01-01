
import { Component, OnInit } from '@angular/core';
import { UserRegistrationService } from '../fetch-api-data.service'
import { ProfileViewComponent } from '../profile-view/profile-view.component';
import { MatDialog } from '@angular/material/dialog';
import { MovieDetailsDialogComponent } from '../movie-details-dialog/movie-details-dialog.component';

/**
 * Represents the MovieCardComponent, which displays a list of movies, allows the user to view movie details,
 * and manage their favorite movies.
 * 
 * @component
 */

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})

export class MovieCardComponent implements OnInit {

  /**
   * Array to hold movie objects.
   * @type {any[]}
   */
  movies: any[] = [];

  /**
   * Array to hold the IDs of the user's favorite movies.
   * @type {string[]}
   */
  favorites: string[] = [];

  /**
 * To store user information, including favorites.
 * @type {any}
 */
  user: any = {}; // To store user information



  /**
 * Creates an instance of the MovieCardComponent.
 * 
 * @param {UserRegistrationService} fetchApiData - Service to fetch API data related to user and movies.
 * @param {MatDialog} dialog - Service to manage dialogs for user interaction.
 */
  constructor(
    public fetchApiData: UserRegistrationService,
    public dialog: MatDialog
  ) { }


  /**
 * Lifecycle hook that is called after the component has been initialized.
 * Fetches all movies and the user data (favorites) on initialization.
 */
  ngOnInit(): void {
    this.getAllMovies();
    this.getUserData(); // Load the user's favorites on initialization
  }


  /**
     * Fetches a list of all movies from the API and filters out movies without an ID.
     * Logs the titles and IDs of the loaded movies.
     */

  getAllMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp.filter((movie: any) => movie._id); // Filter out movies with no ID
      console.log('Movies loaded: ' + this.movies);

      // Log the titles of all movies
      this.movies.forEach(movie => {
        console.log('Movie Title:', movie.Title, 'Movie ID:', movie._id);
      });
      return this.movies;
    });
  }

  /**
 * Opens the profile view dialog where the user can view their profile.
 * The dialog will use the ProfileViewComponent as its content.
 */

  openProfileViewDialog(): void {
    this.dialog.open(ProfileViewComponent, {
      width: '280px'
    });
  }


  /**
* Opens a movie details dialog with detailed information about a specific movie.
* 
* @param {any} movie - The movie object that contains details to be displayed in the dialog.
*/
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


  /**
   * Fetches the user's favorite movies from local storage and API, and stores them in the favorites array.
   * Logs the favorite movies.
   */
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

   /**
   * Toggles the favorite status of a movie (adds/removes from favorites).
   * 
   * @param {any} movie - The movie object to toggle in the favorites list.
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

 /**
   * Checks if a movie is already marked as a favorite.
   * 
   * @param {string} movie - The movie ID to check for in the favorites list.
   * @returns {boolean} - True if the movie is a favorite, otherwise false.
   */

  isFavorite(movie: string): boolean {
    return this.favorites.includes(movie);
  }

    /**
   * Fetches the user data (including favorites) from local storage and the API.
   * Stores the user data in the `user` and `favorites` properties.
   */

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