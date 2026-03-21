import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.services';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})

export class LoginPageComponent {
  path:any;
  isValidated: boolean = false;
  loginForm: any;
  loading = false;
  submitted = false;
  formBuilder: any;
  userName: any;
  password: any;
  isRegistration: boolean = false;
  userList: any[] = [];
  constructor(private router: Router, private commonService: CommonService) {}
  ngOnInit(): void {
      this.getUserList();
    }
  getUserList() {
    this.commonService.getUser().subscribe({
      next: (response) => {
        console.log('User list retrieved successfully:', response);
        this.userList = response;
        // Handle the response as needed
      },
      error: (error) => {
        console.error('Error retrieving user list:', error);
        // Handle the error as needed
      }
    });
  }  
  onFormSubmit() {
    this.userList.forEach((user) => {
      if (user.userName === this.userName && user.password === this.password) {
        this.isValidated = true;
        this.commonService.setLoggedInUser({ name: user.firstName + " " + user.lastName , userName: user.userName }); // Store logged-in user info
        this.router.navigate(['home']);
      }
    });
      this.submitted = true;
        if (!this.isValidated) {
          // Handle invalid login
          alert('Invalid username or password. Please try again.');
        } else {
          // Handle successful login
          alert('Login successful!');
          
          this.router.navigate(['client-details']);
        }
    }
    onRegister() {
      this.isRegistration = true;
      this.router.navigate(['registration']);
    }

}
