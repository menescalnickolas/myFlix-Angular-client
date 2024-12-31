import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';


//Declaring the api url that will provide data for the client app
const apiUrl = 'https://testflix2-2b11acffaf24.herokuapp.com';
@Injectable({
  providedIn: 'root'
})
export class UserRegistrationService {
  // Inject the HttpClient module to the constructor params
 // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {
  }


  private getToken(): string {
    const token = localStorage.getItem('token'); // Ensure you're accessing the correct key
    return token || ''; // Return an empty string if no token is found
  }

 // Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + '/users', userDetails).pipe(
    catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.status !== 200) {
      if (error.error instanceof ErrorEvent) {
        console.error('Some error occurred:', error.error.message);
      } else {
        console.error(
          `Error Status code ${error.status}, ` +
          `Error body is: ${error.error}`
        );
      }
      return throwError(
        'Something bad happened; please try again later.'
      );
    } else {
      console.log('Request was successful:', error);  // Add this to track success
      return error;
    }
  }

// User Login
public userLogin(userDetails: any): Observable<any> {
  return this.http.post(apiUrl + '/login', userDetails).pipe(
    map((response: any) => {
      if (response.token) {
        console.log('Token received:', response.token); // Debug log
        localStorage.setItem('token', response.token); // Save the token to localStorage
      }else {
        console.error('No token received from server.');
      }
      return response;
    }),
    catchError(this.handleError)
  );
}

// Get all movies
public getAllMovies(): Observable<any> {
  const token = this.getToken();
  console.log('Retrieved Token:', token); // Debug log


  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  console.log('Token:', localStorage.getItem('token'));

  return this.http.get(apiUrl + '/movies', { headers }).pipe(
    map(this.extractResponseData),
    catchError(this.handleError),
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
      Authorization: `Bearer ${this.getToken()}`,
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
      Authorization: `Bearer ${this.getToken()}`,
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
      Authorization: `Bearer ${this.getToken()}`,
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
      Authorization: `Bearer ${this.getToken()}`,
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
      Authorization: `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json',
    })}).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

// Add movie to favorites
public addFavoriteMovie(Username: string, movie: any): Observable<any> {
  
  console.log('Adding to favorites:', `users/${Username}/movies/${movie}`);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = user?.token;

  return this.http.post(apiUrl + '/users/' + Username + '/movies/' + movie, {headers: new HttpHeaders(
    {
      Authorization: `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json',
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
      Authorization: `Bearer ${this.getToken()}`,
    })}).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}


// Edit user info
public editUser(Username: string, updatedUser: any): Observable<any> {
  return this.http.put(apiUrl + `/users/${Username}`, updatedUser, {
    headers: new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    }),
  });
}


// Delete user
public deleteUser(Username: string): Observable<any> {
  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.getToken()}`
  });

  return this.http.delete(`${apiUrl}/users/${Username}`, { 
    headers,
    responseType: 'text' as 'json'
  
  }).pipe(
    catchError((error: HttpErrorResponse) => {
      let parsedError = error;

      if (error.status === 200 && typeof error.error === 'string') {
        try {
          const parsedResponse = JSON.parse(error.error);
          parsedError = { ...error, error: parsedResponse };  // Create a new object with the parsed response
        } catch (e) {
          console.error('Error parsing response:', e);
        }
      }

      return throwError(parsedError);
    })
  );
}

public getUserByID(id: string): Observable<any> {
  return this.http.get(apiUrl + `/user/${id}`, {headers: new HttpHeaders(
  {
      Authorization: `Bearer ${this.getToken()}`,
  })}).pipe(
      map(this.extractResponseData), catchError(this.handleError)
  );
}

}