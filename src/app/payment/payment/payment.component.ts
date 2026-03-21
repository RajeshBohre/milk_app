import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CommonService } from '../../services/common.services';
@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
Name: string = '';
amount: string = '';
paymentDate: Date = new Date();
private routeSub: Subscription = new Subscription();
userName: String = '';
mainData: any;
constructor(private route: ActivatedRoute, private commonService: CommonService){}
ngOnInit(): void {
  this.userName = this.commonService.getLoggedInUser()?.userName || '';
    this.routeSub = this.route.paramMap.subscribe((params: ParamMap) => {
         // first try route param
         let id = params.get('id');
         // fallback to navigation state (if you used router.navigate(['/bill'], { state: { id } }))
         if (!id && history && (history.state && (history.state as any).id)) {
           id = (history.state as any).id;
         }
         if (id) {
        console.log('Loaded id:', id);
        //this.id = id;
        this.getBills(id);
        // TODO: call service to load bill by id and populate fields:
        // this.commonService.getBillById(id).subscribe(b => { this.patientName = b.patientName; ... });
      }
        })
  }
   getBills(id: string): void {
    const req = { userName: this.userName };
    this.commonService.getDetailsMilkMan(req).subscribe({
      next: (data) => {
       this.mainData = data;
       this.mainData.forEach((b: any) => {
          if (b._id === id) {
            this.Name = b.Name;
            
            this.amount = b.Amount;
            this.paymentDate = b.billDate;
            
          }
        });
      },
      error: (err) => {
        //this.error = this.(err);
        
      }
    });
  }
onSubmit() {
  // Implement payment submission logic here, e.g., call a service to save payment details
  console.log('Payment submitted:', { Name: this.Name, amount: this.amount, paymentDate: this.paymentDate });
  alert('Payment submitted successfully!');
  const req = {
    Name: this.Name, amount: this.amount, paymentDate: this.paymentDate , userName: this.userName,
  }
  this.commonService.paymentEntry(req).subscribe({
      next: (response) => {
        //this.displayModal = true;
        console.log('Bill created successfully:', response);
      },
      error: (error) => {
        console.error('Error creating bill:', error);
      }
    });
}
backToList(): void {

  // Navigate back to the client details list (you can use Angular Router for this)
  window.history.back(); // simple way to go back, or use this.router.navigate(['/client-details']);  
}
}
