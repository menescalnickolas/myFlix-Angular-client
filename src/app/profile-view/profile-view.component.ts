import { Component, OnInit } from '@angular/core';
import { UserRegistrationService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { EditUserScreenComponent } from '../edit-user-screen/edit-user-screen.component';
import { MatDialog } from '@angular/material/dialog';


/**
 * Represents the ProfileViewComponent, which displays the user's profile,
 * their favorite movies, and allows editing and logging out.
 * 
 * @component
 */

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss'],
})

export class ProfileViewComponent implements OnInit {


  /**
   * The user's data, retrieved from localStorage or API.
   * @type {Object}
   */
  userData: any = {};

  /**
  * The list of the user's favorite movies.
  * @type {Array}
  */
  favoriteMovies: any[] = [];

  /**
 * The list of movies retrieved from the backend.
 * @type {Array}
 */
  movies: any[] = [];


  /**
 * Creates an instance of ProfileViewComponent.
 * 
 * @param {UserRegistrationService} fetchApiData - Service to fetch user and movie data.
 * @param {Router} router - Angular's Router service to navigate between views.
 * @param {MatDialog} dialog - Angular Material dialog service to open dialogs.
 * @param {MatDialogRef<ProfileViewComponent, EditUserScreenComponent>} dialogRef - Reference to close the dialog.
 */
  constructor(
    public fetchApiData: UserRegistrationService,
    public router: Router,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ProfileViewComponent, EditUserScreenComponent>,
  ) {
    this.userData = JSON.parse(localStorage.getItem("user") || "");
  }


  /**
 * Lifecycle hook that is called after the component has been initialized.
 * Fetches user data and their favorite movies.
 */
  ngOnInit(): void {
    this.getUser();
    this.getFavorites();
  }

  /**
 * Resets the user data by fetching it from localStorage.
 */
  resetUser(): void {
    this.userData = JSON.parse(localStorage.getItem("user") || "");
  }

  /**
 * Navigates the user back to the movie listing page.
 */
  backToMovie(): void {
    this.router.navigate(["movies"]);
  }

  /**
 * Fetches the user's favorite movies from the backend API.
 */
  getFavorites(): void {
    const Username = localStorage.getItem('user');
    if (Username) {
      this.fetchApiData.getFavoriteMovies(Username).subscribe((movies: any) => {
        this.favoriteMovies = movies;
      });
    }
  }


  /**
 * Fetches the user data from the backend API using the user's ID.
 * Updates the localStorage with the latest user data.
 */
  getUser(): void {
    this.fetchApiData.getUserByID(this.userData.id).subscribe((res: any) => {
      this.userData = {
        ...res,
        id: res._id,
        password: this.userData.password,
        token: this.userData.token
      };
      localStorage.setItem("user", JSON.stringify(this.userData));
      this.getFavorites();
    })
  }


  /**
 * Removes a movie from the user's favorites by sending a request to the backend API.
 * 
 * @param {Object} movie - The movie to be removed from favorites.
 */
  removeFromFavorite(movie: any): void {
    this.fetchApiData.deleteFavoriteMovie(this.userData.id, movie.title).subscribe((res: any) => {
      this.userData.favoriteMovies = res.favoriteMovies;
      this.getFavorites();
    }, (err: any) => {
      console.error(err)
    })
  }


  /**
 * Logs out the user by clearing their data from localStorage and navigating to the welcome page.
 * Closes the profile dialog after a short delay.
 */
  logout(): void {
    this.router.navigate(["welcome"]);
    localStorage.removeItem("user");

    setTimeout(() => {
      this.dialogRef.close();
    }, 100);
  }



  /**
   * Opens a dialog to edit the user's profile.
   * Closes the profile dialog after a short delay.
   */
  openEditProfileDialog(): void {
    this.dialog.open(EditUserScreenComponent, {
      width: '280px'
    });
    setTimeout(() => {
      this.dialogRef.close();
    }, 100);

  }
}