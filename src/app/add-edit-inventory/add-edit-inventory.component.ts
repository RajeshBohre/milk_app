import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonService } from '../services/common.services';

@Component({
  selector: 'app-add-edit-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-inventory.component.html',
  styleUrl: './add-edit-inventory.component.css'
})
export class AddEditInventoryComponent {
  constructor(private commonService: CommonService) {}
  inventoryItem = {
  id: null,
  product: '',
  quantity: null,
  price: null ,
  userName: this.commonService.getLoggedInUser()?.userName || ''
}
saveInventoryItem() {
  // Logic to save the inventory item (e.g., call a service to save to backend)
  console.log('Saving inventory item:', this.inventoryItem);
  this.commonService.insertInventoryEntry(this.inventoryItem).subscribe({
      next: (response) => {
          console.log('Inventory item saved successfully:', response);
      },
      error: (error) => {
          console.error('Error saving inventory item:', error);
      }
  });
}
}
