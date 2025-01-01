import { Component, OnInit, Input } from '@angular/core';

// Use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls 
import { UserRegistrationService} from '../fetch-api-data.service';

// Pop-up message to user
import { MatSnackBar } from '@angular/material/snack-bar';


/**
 * Represents the UserRegistrationFormComponent, which handles the user registration form,
 * submits the data to the backend, and provides feedback to the user.
 * 
 * @component
 */

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
export class UserRegistrationFormComponent implements OnInit {
  
 /**
   * Input data from the parent component representing the user registration form fields.
   * @type {Object}
   */

  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

 /**
   * Creates an instance of the UserRegistrationFormComponent.
   * 
   * @param {UserRegistrationService} fetchApiData - Service to handle user registration API calls.
   * @param {MatDialogRef<UserRegistrationFormComponent>} dialogRef - Reference to close the dialog on success.
   * @param {MatSnackBar} snackBar - Service to display notifications back to the user.
   */

constructor(
    public fetchApiData: UserRegistrationService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar) { }

 /**
   * Lifecycle hook that is called after the component has been initialized.
   * Currently does nothing but can be used for additional initialization logic.
   */

ngOnInit(): void {
}

  /**
   * Registers a new user by sending the form data to the backend API.
   * On success, the modal is closed and a success message is shown.
   * On failure, an error message is shown.
   */
registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe((result) => {
      // This will close the modal on success!
      this.dialogRef.close(); 
      
     // Displays a success message to the user
     this.snackBar.open(result, 'OK', {
        duration: 2000
     });
    }, (result) => {
      // Displays an error message if registration fails
      this.snackBar.open(result, 'OK', {
        duration: 2000
      });
    });
  }

  }