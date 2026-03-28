import { Component } from '@angular/core';
import { CommonService } from '../services/common.services';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule , DatePipe} from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  selector: 'app-add-edit-kirana-client',
  templateUrl: './add-edit-kirana-client.component.html',
  styleUrls: ['./add-edit-kirana-client.component.scss']
})
export class AddEditKiranaClientComponent {
  // Form fields
  Name: string = '';
  comment: string = '';
  Amount: string = '';
  billDate: Date = new Date();
  mainData: any = null;
  id: string | null = null;
  private routeSub: Subscription = new Subscription();
  displayModal: boolean = false;
  userName: string = '';
  paymentStatus: string = 'Pending';
  today: string = ''; // To store the formatted date string
  constructor(private commonService: CommonService, private route: ActivatedRoute) {}
  ngOnInit(): void {
    const now = new Date();
    
    // Format the date to 'yyyy-MM-dd' for HTML date inputs
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    this.today = `${year}-${month}-${day}`;
    this.billDate = now; // Set the default bill date to today
    this.userName = this.commonService.getLoggedInUser()?.userName || '';
    // Load all bills to find the one we want to edit (for demo purposes)
      this.routeSub = this.route.paramMap.subscribe((params: ParamMap) => {
      // first try route param
      let id = params.get('id');
      // fallback to navigation state (if you used router.navigate(['/bill'], { state: { id } }))
      if (!id && history && (history.state && (history.state as any).id)) {
        id = (history.state as any).id;
      }
      if (id) {
        console.log('Loaded id:', id);
        this.id = id;
        this.getBills(id);
        // TODO: call service to load bill by id and populate fields:
        // this.commonService.getBillById(id).subscribe(b => { this.patientName = b.patientName; ... });
      }
    });
    
  }
  ngOnDestroy() {
    this.routeSub.unsubscribe(); // Prevents memory leaks
  }
  getBills(id: string): void {
    const req = { userName: this.userName };
    this.commonService.getDetailsKirana(req).subscribe({
      next: (data) => {
       this.mainData = data;
       this.mainData.forEach((b: any) => {
          if (b._id === id) {
            this.Name = b.Name;
            this.comment = b.comment;
            this.Amount = b.Amount;
            this.billDate = b.billDate;
            this.paymentStatus = b.paymentStatus;
            
          }
        });
      },
      error: (err) => {
        //this.error = this.(err);
        
      }
    });
  }
  editBill(): void {
    // This method can be used to load existing bill data for editing.
    // You can fetch the bill by ID and populate the form fields.
  }
  onSubmit(): void {
    const billData = {
      Name: this.Name,
      comment: this.comment,
      Amount: this.Amount,
      billDate: this.billDate,
      userName: this.userName,
      paymentStatus: this.paymentStatus,
     
      ...(this.id ? { _id: this.id } : {}) // include _id only if we have an id (for update)
    };
    if(this.id) {
      this.commonService.updateKiranaEntry(billData).subscribe({
      next: (response) => {
        console.log('Bill updated successfully:', response);
      },
      error: (error) => {
        console.error('Error updating bill:', error);
      }
    });
    } else {
      //this.checkDuplicateInvoice(); // Check for duplicates before creating new bill
      this.commonService.createKiranaEntry(billData).subscribe({
      next: (response) => {
        this.displayModal = true;
        console.log('Bill created successfully:', response);
      },
      error: (error) => {
        console.error('Error creating bill:', error);
      }
    });
  }
}
backToList(): void {

  // Navigate back to the client details list (you can use Angular Router for this)
  window.history.back(); // simple way to go back, or use this.router.navigate(['/client-details']);  
}
}
