import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';


//Declaring the api url that will provide data for the client app
const apiUrl = 'https://git.heroku.com/mytestflix.git';
@Injectable({
  providedIn: 'root'
})
export class UserRegistrationService {
  // Inject the HttpClient module to the constructor params
 // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {
  }


 // Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + '/users/', userDetails).pipe(
    catchError(this.handleError)
    );
  }

private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
    console.error('Some error occurred:', error.error.message);
    } else {
    console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError(
    'Something bad happened; please try again later.');
  }

// User Login
public userLogin(userDetails: any): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.post(apiUrl + '/login/', userDetails).pipe(
    catchError(this.handleError)
  );
}


// Get all movies
  public getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + '/movies', {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }
// Non-typed response extraction
  private extractResponseData(res: any): any {
    const body = res;
    return body || { };
  }

// Get a single movie
public getMovie(title: string): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.get(apiUrl + '/movies/' + title, {headers: new HttpHeaders(
    {
      Authorization: 'Bearer ' + token,
    })}).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

// Get director
public getDirector(name: string): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.get(apiUrl + '/movies/director/' + name, {headers: new HttpHeaders(
    {
      Authorization: 'Bearer ' + token,
    })}).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

//Get genre 
public getGenre(name: string): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.get(apiUrl + '/movies/genre/' + name, {headers: new HttpHeaders(
    {
      Authorization: 'Bearer ' + token,
    })}).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

// Get all users
public getAllUsers(): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.get(apiUrl + '/users', {headers: new HttpHeaders(
    {
      Authorization: 'Bearer ' + token,
    })}).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

// Get favorite movies
public getFavoriteMovies(Username: string): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.get(apiUrl + '/users/' + Username + '/movies', {headers: new HttpHeaders(
    {
      Authorization: 'Bearer ' + token,
    })}).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

// Add movie to favorites
public addFavoriteMovie(Username: string, MovieID: string): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.post(apiUrl + '/users/' + Username + '/movies/' + MovieID, {headers: new HttpHeaders(
    {
      Authorization: 'Bearer ' + token,
    })}).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

// Delete movie from favorites
public deleteFavoriteMovie(Username: string, MovieID: string): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.delete(apiUrl + '/users/' + Username + '/movies/' + MovieID, {headers: new HttpHeaders(
    {
      Authorization: 'Bearer ' + token,
    })}).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}


// Edit user info
public editUser(userDetails: any): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.put(apiUrl + '/users/', userDetails, {headers: new HttpHeaders(
    {
      Authorization: 'Bearer ' + token,
    })}).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

// Delete user
public deleteUser(Username: string): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.delete(apiUrl + '/users/' + Username, {headers: new HttpHeaders(
    {
      Authorization: 'Bearer ' + token,
    })}).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

}