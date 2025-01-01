import { Component, OnInit, Input } from '@angular/core';
import { UserRegistrationService } from '../fetch-api-data.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';


/**
 * Represents the LoginFormComponent, which handles the login process for users.
 * 
 * @component
 */

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

    /**
   * The user data object containing the username and password entered by the user.
   * 
   * @type {object}
   * @property {string} Username - The username of the user.
   * @property {string} Password - The password of the user.
   */

  @Input() userData = { Username: '', Password: '' };


   /**
   * Creates an instance of the LoginFormComponent.
   * 
   * @param {UserRegistrationService} fetchApiData - Service to handle user authentication API calls.
   * @param {MatDialogRef<LoginFormComponent>} dialogRef - The reference to close the dialog on success or failure.
   * @param {MatSnackBar} snackBar - The Snackbar service used to show notifications.
   * @param {Router} router - The Angular router to navigate to other routes after successful login.
   */
constructor(
    public fetchApiData: UserRegistrationService,
    public dialogRef: MatDialogRef<LoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) { }

ngOnInit(): void {
}

  /**
   * This method sends the login form data to the backend to authenticate the user.
   * If successful, it closes the dialog, shows a welcome message, stores the user data in localStorage,
   * and navigates to the movies page. If login fails, it shows a failure message.
   * 
   * @returns {void}
   */
  
  logInUser() : void {
  this.fetchApiData.userLogin(this.userData).subscribe(res => {
      this.dialogRef.close();
      
      this.snackBar.open(`Welcome ${res.user.Username}`, "OK", {
          duration: 2000
      });
      let user = {
          ...res.user,
          id: res.user._id,
          password: this.userData.Password,
          token: res.token
      }
      localStorage.setItem("user", JSON.stringify(user));
      this.router.navigate(["movies"]);
  }, res => {
      this.snackBar.open("Login failed", "OK", {
          duration: 2000
      })
  })
}

  }