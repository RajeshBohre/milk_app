import { Component } from '@angular/core';
import { CommonService } from '../services/common.services';
import { Router } from '@angular/router';
import { ColDef, GridApi, GridReadyEvent, RowNode } from 'ag-grid-community';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-history',
  standalone: true,
  imports: [AgGridModule, CommonModule, FormsModule ],
  templateUrl: './payment-history.component.html',
  styleUrl: './payment-history.component.css'
})
export class PaymentHistoryComponent {
ledgerEntries: any[] = [];

  constructor(private commonService: CommonService, private router: Router) {}
  ngOnInit(): void {
   this.loadPaymentHistory();
  }
  loadPaymentHistory(): void {
    const req = { userName: this.commonService.getLoggedInUser().userName };
    this.commonService.getPaymentHistory(req).subscribe({
      next: (data) => {
        data.forEach((entry: any) => {
          entry.date = new Date(entry.date).toLocaleDateString(); // Format date for display
        });
        this.ledgerEntries = Array.isArray(data) ? data : [];
        this.ledgerEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        this.ledgerEntries.forEach((entry: any) => {
          entry.balance = (Number(entry.balance) || 0).toFixed(2);
        });
      },
      error: (error) => {
        console.error('Error loading payment history:', error);
      }
    });
  }
  addLedgerEntry():void {
    this.router.navigate(['payment']);
  }
  editLedgerEntry(): void {
    // Navigate to payment page with entry data for editing
    this.router.navigate(['payment']);
  }
  // deleteEntry(entry: any): void {
  //   if (confirm('Are you sure you want to delete this entry?')) {
  //     const req = { id: entry._id, userName: this.commonService.getLoggedInUser().userName };
  //     this.commonService.deletePaymentEntry(req).subscribe({
  //       next: () => {
  //         console.log('Entry deleted successfully');
  //         this.loadPaymentHistory(); // Refresh the list after deletion
  //       },
  //       error: (err) => {
  //         console.error('Error deleting entry:', err);
  //       }
  //     });
  //   }
  // }
} 
