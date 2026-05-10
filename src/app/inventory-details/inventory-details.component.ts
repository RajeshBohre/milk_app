import { Component } from '@angular/core';
import { AgGridModule } from "ag-grid-angular";

import { Router } from '@angular/router';
import { CommonService } from '../services/common.services';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-inventory-details',
  standalone: true,
  imports: [AgGridModule],
  templateUrl: './inventory-details.component.html',
  styleUrl: './inventory-details.component.css'
})
export class InventoryDetailsComponent {
  constructor(private http: HttpClient, private commonService: CommonService, private router: Router) {}
  
  rowData = [
    { id: 1, product: 'Milk', quantity: 100, price: 50 },
    { id: 2, product: 'Bread', quantity: 200, price: 30 },
    { id: 3, product: 'Eggs', quantity: 150, price: 60 },
  ];

  columnDefs = [
    { headerName: 'ID', field: 'id' },
    { headerName: 'Product', field: 'product' },
    { headerName: 'Quantity', field: 'quantity' },
    { headerName: 'Price', field: 'price' },
  ];
  addInventoryItem() {
    const newItem = { id: this.rowData.length + 1, product: 'New Product', quantity: 0, price: 0 };
    this.rowData = [...this.rowData, newItem];
    this.router.navigate(['add-inventory']);
  }

  editInventoryItem() {
    // Logic to edit an inventory item
  }

  deleteInventoryItem() {
    // Logic to delete an inventory item
  }

  downloadPdf() {
    // Logic to download inventory as PDF
  }
}
