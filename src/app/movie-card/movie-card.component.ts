
import { Component, OnInit } from '@angular/core';
import { UserRegistrationService } from '../fetch-api-data.service'

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})

export class MovieCardComponent {
  movies: any[] = [];
  constructor(public fetchApiData: UserRegistrationService,) { }

ngOnInit(): void {
  this.getAllMovies();
}

getAllMovies(): void {
  this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log('Movies loaded: ' + this.movies);
      return this.movies;
    });
  }
}