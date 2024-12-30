import { Component, OnInit } from '@angular/core';
import { UserRegistrationService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-user-screen',
  templateUrl: './edit-user-screen.component.html',
  styleUrls: ['./edit-user-screen.component.scss']
})
export class EditUserScreenComponent implements OnInit {
  userData: any = {};

  constructor(
    public fetchApiData: UserRegistrationService,
    public router: Router,
      public dialogRef: MatDialogRef <EditUserScreenComponent>,
  ) {
    this.userData = JSON.parse(localStorage.getItem("user") || "");
  }

  ngOnInit(): void {}

  updateUser(): void {
    if (!this.userData.Username) {
      alert("Username is required.");
      return;
    }

    this.fetchApiData.editUser(this.userData).subscribe(
      (res: any) => {
      this.userData = {
        ...res,
        id: res._id,
        password: this.userData.Password,
        token: this.userData.token
      };
      localStorage.setItem("user", JSON.stringify(this.userData));
      alert("Profile updated successfully!");
    },
    (err: any) => {
      console.error(err);
      alert("Failed to update profile.");
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