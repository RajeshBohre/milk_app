import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonService } from '../../services/common.services';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  isRegistration: boolean = false;
  firstName: String = '';
  lastName: String = '';
  mobileNumber: string = '';
  address: String = '';
  password: String = '';
  userName: String = '';
  constructor(private commonService: CommonService) {}

  onRegister() {
    const tempUsername = this.firstName[0] + this.lastName[0] + this.mobileNumber.slice(-5);
    const userData = {
      firstName: this.firstName,
      lastName: this.lastName,
      mobileNumber: this.mobileNumber,
      address: this.address,
      password: this.password,
      userName: tempUsername
    };
    this.commonService.userRegister(userData).subscribe({
      next: (response) => {
        console.log('User registered successfully:', response);
        this.isRegistration = true;
      },
      error: (error) => {
        console.error('Error registering user:', error);
      }
    });
  }

}
