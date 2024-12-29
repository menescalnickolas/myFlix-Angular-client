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
    public router: Router
  ) {
    this.userData = JSON.parse(localStorage.getItem("user") || "");
  }

  ngOnInit(): void {
    this.updateUser();
  }

  updateUser(): void {
    this.fetchApiData.editUser(this.userData).subscribe((res: any) => {
      this.userData = {
        ...res,
        id: res._id,
        password: this.userData.password,
        token: this.userData.token
      };
      localStorage.setItem("user", JSON.stringify(this.userData));
    }, (err: any) => {
      console.error(err)
    })
  }

 deleteUser(): void {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      this.fetchApiData.deleteUser(this.userData.Username).subscribe(
        () => {
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
  }

}