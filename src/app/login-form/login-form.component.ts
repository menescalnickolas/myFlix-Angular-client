import { Component, OnInit, Input } from '@angular/core';
import { UserRegistrationService } from '../fetch-api-data.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  @Input() userData = { Username: '', Password: '' };

constructor(
    public fetchApiData: UserRegistrationService,
    public dialogRef: MatDialogRef<LoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) { }

ngOnInit(): void {
}

// This is the function responsible for sending the form inputs to the backend
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