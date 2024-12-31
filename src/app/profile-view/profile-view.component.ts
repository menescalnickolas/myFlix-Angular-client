import { Component, OnInit } from '@angular/core';
import { UserRegistrationService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { EditUserScreenComponent } from '../edit-user-screen/edit-user-screen.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss'],
})

export class ProfileViewComponent implements OnInit {
  userData: any = {};
  favoriteMovies: any[] = [];
  movies: any[] = [];

  constructor(
    public fetchApiData: UserRegistrationService,
    public router: Router,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ProfileViewComponent, EditUserScreenComponent>,
  ) {
    this.userData = JSON.parse(localStorage.getItem("user") || "");
  }

  ngOnInit(): void {
    this.getUser();
    this.getFavorites();
  }

  resetUser(): void {
    this.userData = JSON.parse(localStorage.getItem("user") || "");
  }
  backToMovie(): void {
    this.router.navigate(["movies"]);
  }

  getFavorites(): void {
    const Username = localStorage.getItem('user');
    if (Username) {
      this.fetchApiData.getFavoriteMovies(Username).subscribe((movies: any) => {
        this.favoriteMovies = movies;
      });
    }
  }

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

  removeFromFavorite(movie: any): void {
    this.fetchApiData.deleteFavoriteMovie(this.userData.id, movie.title).subscribe((res: any) => {
      this.userData.favoriteMovies = res.favoriteMovies;
      this.getFavorites();
    }, (err: any) => {
      console.error(err)
    })
  }
  
  logout(): void {
    this.router.navigate(["welcome"]);
    localStorage.removeItem("user");

    setTimeout(() => {
      this.dialogRef.close();
    }, 100);
  }

  openEditProfileDialog(): void {
      this.dialog.open(EditUserScreenComponent, {
        width: '280px'
      });
      setTimeout(() => {
        this.dialogRef.close();
      }, 100);
    
    }
}