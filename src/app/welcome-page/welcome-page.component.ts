import { Component, OnInit } from '@angular/core';
import { LoginFormComponent } from '../login-form/login-form.component';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { MatDialog } from '@angular/material/dialog';

/**
 * Represents the WelcomePageComponent, which is the main component of the welcome page.
 * Provides methods to open user login and registration dialogs.
 * 
 * @component
 */


@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit {

  /**
   * Creates an instance of the WelcomePageComponent.
   * 
   * @param {MatDialog} dialog - The MatDialog service to manage dialogs in the component.
   */

  constructor(public dialog: MatDialog) { }


  /**
   * Lifecycle hook that is called after the component has been initialized.
   * This method is used to perform any setup or initialization logic for the component.
   * Currently, it doesn't perform any actions since it's empty.
   */
  ngOnInit(): void {
  }


  /**
   * Opens the user registration dialog.
   * The dialog will use the UserRegistrationFormComponent as its content.
   * The width of the dialog is set to 280px.
   */
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '280px'
    });
  }

    /**
   * Opens the user login dialog.
   * The dialog will use the LoginFormComponent as its content.
   * The width of the dialog is set to 280px.
   */
openUserLoginDialog(): void {
    this.dialog.open(LoginFormComponent, {
      width: '280px'
    });
  }
}