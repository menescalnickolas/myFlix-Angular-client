
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false, // ensure that the component is not treated as a standalone component
})
export class AppComponent {
  title = 'myFlix-Angular-client';

    /**
   * Creates an instance of the AppComponent.
   * @param {Router} router - The Router service used for navigation.
   */
  constructor(public router: Router) {}

   /**
   * Clears the local storage and navigates to the welcome page.
   * This method is triggered when the user logs out.
   */
  logout(): void {
    localStorage.clear();

    //Redirects to welcome page
    this.router.navigate(['welcome']);
  }
}