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
   /**
   * Constructor to inject HttpClient service for making HTTP requests.
   * @param {HttpClient} http - The HttpClient service to perform HTTP requests.
   */
 constructor(private http: HttpClient) {
  }


    /**
   * Retrieves the JWT token from local storage.
   * @returns {string} - The JWT token or an empty string if not found.
   */
  private getToken(): string {
    const token = localStorage.getItem('token'); // Ensure you're accessing the correct key
    return token || ''; // Return an empty string if no token is found
  }

  /**
   * Registers a new user via the API.
   * @param {any} userDetails - The details of the user to register.
   * @returns {Observable<any>} - The observable containing the API response.
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + '/users', userDetails).pipe(
    catchError(this.handleError)
    );
  }


    /**
   * Handles errors that occur during HTTP requests.
   * @param {HttpErrorResponse} error - The error response returned from the HTTP request.
   * @returns {Observable<never>} - Throws an observable error.
   */
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


  /**
   * Logs in a user by posting their login details to the API and storing the received token.
   * @param {any} userDetails - The login credentials of the user.
   * @returns {Observable<any>} - The observable containing the API response.
   */
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


  /**
   * Retrieves all movies from the API.
   * @returns {Observable<any>} - The observable containing the list of movies.
   */
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


  /**
   * Extracts and returns the response data from the HTTP response.
   * @param {any} res - The HTTP response.
   * @returns {any} - The extracted data.
   */
  private extractResponseData(res: any): any {
    const body = res;
    return body || { };
  }


  /**
   * Retrieves a single movie by its title.
   * @param {string} title - The title of the movie to retrieve.
   * @returns {Observable<any>} - The observable containing the movie details.
   */
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

  /**
   * Retrieves movies by a specific director.
   * @param {string} name - The name of the director.
   * @returns {Observable<any>} - The observable containing the movies directed by the given director.
   */
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

  /**
   * Retrieves movies of a specific genre.
   * @param {string} name - The name of the genre.
   * @returns {Observable<any>} - The observable containing the movies of the given genre.
   */
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

  /**
   * Retrieves all users from the API.
   * @returns {Observable<any>} - The observable containing the list of users.
   */
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

 /**
   * Retrieves the favorite movies of a specific user.
   * @param {string} Username - The username of the user whose favorite movies to retrieve.
   * @returns {Observable<any>} - The observable containing the user's favorite movies.
   */
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

 /**
   * Adds a movie to a user's favorites list.
   * @param {string} Username - The username of the user.
   * @param {any} movie - The movie to add to favorites.
   * @returns {Observable<any>} - The observable containing the API response.
   */
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

  /**
   * Deletes a movie from a user's favorites list.
   * @param {string} Username - The username of the user.
   * @param {string} MovieID - The ID of the movie to remove from favorites.
   * @returns {Observable<any>} - The observable containing the API response.
   */
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

  /**
   * Edits a user's information.
   * @param {string} Username - The username of the user to update.
   * @param {any} updatedUser - The new user data to update.
   * @returns {Observable<any>} - The observable containing the API response.
   */
public editUser(Username: string, updatedUser: any): Observable<any> {
  return this.http.put(apiUrl + `/users/${Username}`, updatedUser, {
    headers: new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    }),
  });
}


  /**
   * Deletes a user from the system.
   * @param {string} Username - The username of the user to delete.
   * @returns {Observable<any>} - The observable containing the API response.
   */
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


  /**
   * Retrieves a user by their ID.
   * @param {string} id - The ID of the user to retrieve.
   * @returns {Observable<any>} - The observable containing the user data.
   */
public getUserByID(id: string): Observable<any> {
  return this.http.get(apiUrl + `/user/${id}`, {headers: new HttpHeaders(
  {
      Authorization: `Bearer ${this.getToken()}`,
  })}).pipe(
      map(this.extractResponseData), catchError(this.handleError)
  );
}

}