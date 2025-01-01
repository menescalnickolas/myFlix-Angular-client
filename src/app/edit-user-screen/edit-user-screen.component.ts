import { Component, OnInit } from '@angular/core';
import { UserRegistrationService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


/**
 * Represents the EditUserScreenComponent, which allows users to edit their profile information or delete their account.
 * 
 * @component
 */

@Component({
  selector: 'app-edit-user-screen',
  templateUrl: './edit-user-screen.component.html',
  styleUrls: ['./edit-user-screen.component.scss']
})
export class EditUserScreenComponent implements OnInit {
   /**
   * The user data object containing the current user's information.
   * 
   * @type {object}
   */
  userData: any = {};

    /**
   * The updated user data object to store changes made by the user.
   * 
   * @type {object}
   */
  updatedUser: any = {};


   /**
   * Creates an instance of the EditUserScreenComponent.
   * 
   * @param {UserRegistrationService} fetchApiData - Service to handle user-related API calls (e.g., update or delete user).
   * @param {Router} router - The Angular router for navigation.
   * @param {MatDialogRef<EditUserScreenComponent>} dialogRef - Reference to close the dialog on successful updates or deletions.
   * @param {MatSnackBar} snackBar - The Snackbar service used to show notifications to the user.
   */
  constructor(
    public fetchApiData: UserRegistrationService,
    public router: Router,
    public dialogRef: MatDialogRef <EditUserScreenComponent>,
    public snackBar: MatSnackBar,
  ) {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      this.userData = JSON.parse(storedUser);
    } else {
      console.error("No user found in localStorage");
      this.router.navigate(['/welcome']); // Redirect to a safe screen if user data is missing
    }
  }

  ngOnInit(): void {}


  /**
   * This method updates the user profile with the provided updated user data.
   * If the update is successful, it stores the updated user data in localStorage, 
   * shows a success message, and closes the dialog. If it fails, an error message is shown.
   * 
   * @returns {void}
   */
  updateUser(): void {

    this.fetchApiData.editUser(this.userData.Username, this.updatedUser).subscribe(
      (resp: any) => {
        console.log('Response:', resp);
        this.snackBar.open('Update Successful!', 'OK', {
          duration: 1000,
        });
        localStorage.setItem('user', JSON.stringify(resp));
        this.dialogRef.close(); // Optionally close the dialog after update
      },
      (result) => {
        this.snackBar.open(result, 'OK', {
          duration: 1000,
        });
      }
    );
  }


    /**
   * This method deletes the user account after confirming the user's decision.
   * Upon successful deletion, it clears localStorage, shows an alert, 
   * and redirects the user to the welcome page.
   * 
   * @returns {void}
   */

 deleteUser(): void {
  console.log('Deleting user with username:', this.userData.Username);

    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      this.fetchApiData.deleteUser(this.userData.Username).subscribe(
        (res: any) => {
          console.log('Account deleted successfully:', res.message);  // Access the message from JSON
          alert("Your account has been deleted.");
          localStorage.clear();
          this.router.navigate(['/welcome']); // Redirect to welcome or login page
        },
        (err: any) => {
          console.error(err);
          alert("Failed to delete the account.");
        }
      );
    }

    setTimeout(() => {
      this.dialogRef.close();
    }, 100);
  }

}