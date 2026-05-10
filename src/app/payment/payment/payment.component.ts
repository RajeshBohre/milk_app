import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../services/common.services';

interface LedgerEntry {
  date: string;
  particulars: string;
  billNo: string;
  cashDr: number;
  expensesCr: number;
  balance: number;
  userName: string;
}

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, OnDestroy {
  ledgerForm!: FormGroup;
  ledgerEntries: LedgerEntry[] = [];

  private valueSub?: Subscription;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.ledgerForm = this.fb.group({
      date: [this.today(), Validators.required],
      particulars: ['', Validators.required],
      billNo: [''],
      cashDr: ['', [Validators.required, Validators.min(0)]],
      expensesCr: ['', [Validators.required, Validators.min(0)]],
      balance: [{ value: 0, disabled: true }]
    });
    this.loadPaymentHistory();
    // update computed balance whenever cash or expenses change
    this.valueSub = this.ledgerForm.valueChanges.subscribe(() => {
      const cash = Number(this.ledgerForm.get('cashDr')?.value) || 0;
      const exp = Number(this.ledgerForm.get('expensesCr')?.value) || 0;
      const lastBalance = this.ledgerEntries.length ? this.ledgerEntries[this.ledgerEntries.length - 1].balance : 0;
      const balance = lastBalance + cash - exp;
      this.ledgerForm.get('balance')?.setValue(balance, { emitEvent: false });
    });
  }
  loadPaymentHistory(): void {
    const req = { userName: this.commonService.getLoggedInUser().userName };
    this.commonService.getPaymentHistory(req).subscribe({
      next: (data) => {
        this.ledgerEntries = Array.isArray(data) ? data : [];
      },
      error: (error) => {
        console.error('Error loading payment history:', error);
      }
    });
  }
  updateBalance(): void {
    const cash = Number(this.ledgerForm.get('cashDr')?.value) || 0;
    const exp = Number(this.ledgerForm.get('expensesCr')?.value) || 0;
    const lastBalance = this.ledgerEntries.length ? this.ledgerEntries[this.ledgerEntries.length - 1].balance : 0;
    const balance = Number(lastBalance) + Number(cash) - Number(exp);
    this.ledgerForm.get('balance')?.setValue(balance, { emitEvent: false });
  }
  onSubmit(): void {
    this.loadPaymentHistory();
    this.valueSub = this.commonService.getPaymentHistory({ userName: this.commonService.getLoggedInUser().userName }).subscribe({
      next: () => {
      if (!this.ledgerForm || this.ledgerForm.invalid) return;
      let lastBalance = 0;
      if (this.ledgerEntries.length) {
        lastBalance = this.ledgerEntries[this.ledgerEntries.length - 1].balance;
      }
      const raw = this.ledgerForm.getRawValue();
      const entry: LedgerEntry = {
        date: raw.date,
        particulars: raw.particulars,
        billNo: raw.billNo,
        cashDr: Number(raw.cashDr) || 0,
        expensesCr: Number(raw.expensesCr) || 0,
        balance: Number(lastBalance) + (Number(raw.cashDr) || 0) - (Number(raw.expensesCr) || 0) || 0,
        userName: this.commonService.getLoggedInUser().userName
      };
      this.commonService.paymentEntry(entry).subscribe({
        next: () => {
        console.log('Payment entry saved successfully');
        },
        error: (err) => {
        console.error('Error saving payment entry:', err);
        }
      });
      this.ledgerForm.patchValue({
        date: this.today(),
        particulars: '',
        billNo: '',
        cashDr: 0,
        expensesCr: 0,
        balance: Number(entry.balance)
      });
      },
      error: (error) => {
      console.error('Error loading payment history:', error);
      }
    });
    if (!this.ledgerForm || this.ledgerForm.invalid) return;
    let lastBalance = 0;
    if (this.ledgerEntries.length) {
      lastBalance = this.ledgerEntries[this.ledgerEntries.length - 1].balance;
    }
    const raw = this.ledgerForm.getRawValue();
    const entry: LedgerEntry = {
      date: raw.date,
      particulars: raw.particulars,
      billNo: raw.billNo,
      cashDr: Number(raw.cashDr) || 0,
      expensesCr: Number(raw.expensesCr) || 0,
      balance: Number(lastBalance) + (Number(raw.cashDr) || 0) - (Number(raw.expensesCr) || 0) || 0,
      userName: this.commonService.getLoggedInUser().userName
    };
    this.commonService.paymentEntry(entry).subscribe({
      next: () => {
        console.log('Payment entry saved successfully');
      },
      error: (err) => {
        console.error('Error saving payment entry:', err);
      }
    });

    //this.ledgerEntries.push(entry);

    // reset inputs but keep balance as starting point for next entry
    this.ledgerForm.patchValue({
      date: this.today(),
      particulars: '',
      billNo: '',
      cashDr: 0,
      expensesCr: 0,
      balance: entry.balance
    });
  }

  private today(): string {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
  }

  ngOnDestroy(): void {
    this.valueSub?.unsubscribe();
  }
}