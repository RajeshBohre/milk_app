import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonService } from '../services/common.services';
import { count } from 'rxjs/internal/operators/count';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-create-customer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-customer.component.html',
  styleUrl: './create-customer.component.css'
})
export class CreateCustomerComponent {
  Name: string = '';
  Address: string = '';
  contactNumber: string = '';
  today: string = formatDate(new Date(), 'dd/MM/yyyy', 'en');
  createdDate: Date = new Date();
  comment: string = '';
  userName: string = '';
  customerCount: number = 0; // This will be used to generate unique customer IDs
  previousBalance: number = 0;

  constructor(private commonService: CommonService) {}
  ngOnInit(): void {
    // Set default created date to today
    this.userName = this.commonService.getLoggedInUser()?.userName || '';
    this.getUserCount();
    this.createdDate = new Date(this.today);

  }
  getUserCount() {
    const req = { userName: this.userName };
    this.commonService.getCustomerCount(req).subscribe(data => {
      this.customerCount = data.count; // Assuming backend returns { count: number }
    }, error => {
      console.error('Error fetching customer count:', error);
    });
  }

  onSubmit() {
    // Here you would typically send the data to your backend API
    
    const newCustomer = {
      customerId: this.Name.substring(0, 2) + '00' + (this.customerCount + 1), // Example ID generation
      Name: this.Name,
      Address: this.Address,
      contactNumber: this.contactNumber,
      createdDate: this.createdDate,
      previousBalance: this.previousBalance,
      comment: this.comment,
      userName: this.userName
    };
    this.commonService.createNewCustomer(newCustomer).subscribe(response => {
      console.log('Customer created successfully:', response);
      // Optionally show a success message or navigate to another page
    }, error => {
      console.error('Error creating customer:', error);
      // Optionally show an error message
    });
    console.log('New Customer:', newCustomer);
    // Reset form after submission
    this.Name = '';
    this.Address = '';
    this.contactNumber = '';
    this.createdDate = new Date();
    this.comment = '';
    this.previousBalance = 0;
  }
  backToList() {
    // Logic to navigate back to the customer list, e.g., using Angular Router
    // this.router.navigate(['/customer-list']);
  }

}
