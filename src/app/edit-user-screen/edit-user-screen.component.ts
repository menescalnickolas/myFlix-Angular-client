import { Component, OnInit } from '@angular/core';
import { UserRegistrationService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-edit-user-screen',
  templateUrl: './edit-user-screen.component.html',
  styleUrls: ['./edit-user-screen.component.scss']
})
export class EditUserScreenComponent implements OnInit {
  userData: any = {};
  updatedUser: any = {};

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

  updateUser(): void {
   
   /*
    if (!this.updatedUser || Object.keys(this.updatedUser).length === 0) {
      this.snackBar.open('Please provide updated user information.', 'OK', { duration: 2000 });
      return;
    }
*/

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