import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonService } from '../services/common.services';

import { ColDef, GridApi, GridReadyEvent, RowNode } from 'ag-grid-community';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
// Simple Client model — extend with real fields as needed


@Component({
  standalone: true,
  imports: [AgGridModule, CommonModule, FormsModule ],
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss']
})
export class ClientDetailsComponent implements OnInit {
  // variables
  loggedInUser: any = null; // Store logged-in user info
  rowData: any[] = [];
  defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };
   
  columnDefs: ColDef[] = [
    {
      headerName: 'Sr. No.',
      valueGetter: (params) => {
        const idx = params.node?.rowIndex;
        return typeof idx === 'number' ? idx + 1 : null;
      },
      minWidth: 30,
      maxWidth: 80,
      sortable: false,
      filter: false,
      resizable: true
    },
    { headerName: 'Name', field: 'Name', minWidth: 100 },
    { headerName: 'Quantity', field: 'quantity', minWidth: 60,maxWidth: 120, },
    { headerName: 'Fat Content', field: 'fatContent', minWidth: 60,maxWidth: 100, },
    { headerName: 'Milk Type', field: 'milkType', minWidth: 100 ,maxWidth: 100,},
    { headerName: 'Rate', field: 'rate', minWidth: 60 ,maxWidth: 100,},
    { headerName: 'CLR', field: 'clr', minWidth: 60 ,maxWidth: 80,},
    { headerName: 'SNF', field: 'snf', minWidth: 60 ,maxWidth: 80,},
    { headerName: 'Amount', field: 'Amount', minWidth: 150 ,maxWidth: 120,},
    { headerName: 'Payment Status', field: 'paymentStatus', minWidth: 150 },
    { headerName: 'Bill Date', field: 'billDate', minWidth: 200 }

  ];
  loading = false;
  error: string | null = null;

  // store grid API when grid is ready
  gridApi: GridApi | null = null;

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
  }
  
  // If you have a ClientService, inject it instead of HttpClient.
  constructor(private http: HttpClient, private commonService: CommonService, private router: Router) {}

  ngOnInit(): void {
    //this.all();
    this.loggedInUser = this.commonService.getLoggedInUser(); // Get logged-in user info (if needed for display)
    this.getPatients();
  }
  
  getPatients(): void {
    this.loading = true;
    this.error = null;

    this.commonService.getDetailsMilkMan(this.loggedInUser).subscribe({
      next: (data) => {
        const formatDate = (val: any): string => {
          if (val == null) return '';
          const d = new Date(val);
          if (isNaN(d.getTime())) return String(val);
          const dd = String(d.getDate()).padStart(2, '0');
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const yyyy = d.getFullYear();
          return `${dd}-${mm}-${yyyy}`;
        };

        this.rowData = Array.isArray(data)
          ? data.map((item: any) => ({ ...item, billDate: formatDate(item.billDate) }))
          : [];
        this.loading = false;
      },
      error: (err) => {
        //this.error = this.(err);
        this.loading = false;
      }
    });
  }
createClient(): void {
  this.router.navigate(['add-client']);
    // Implement client creation logic here, e.g., navigate to a form for creating a new client.
  }
  editClient(): void {
    if (!this.gridApi) { return; }
    const selectedNodes = this.gridApi.getSelectedNodes();
    if (!selectedNodes || selectedNodes.length === 0) { return; }
    const id = selectedNodes[0].data._id;
    // pass id as URL segment
    this.router.navigate(['edit-client', id]);
    // Implement client editing logic here, e.g., open a form pre-filled with client data.
  }
    paymentToClient(): void {
    if (!this.gridApi) { return; }
    const selectedNodes = this.gridApi.getSelectedNodes();
    if (!selectedNodes || selectedNodes.length === 0) { return; }
    const id = selectedNodes[0].data._id;
    //pass id as URL segment
    if(id) {
      this.router.navigate(['payment', id]);
    } else {
      this.router.navigate(['payment']);
    }
    
  }

  deleteEntry(): void {
    //this.clickMethod('this bill');
     if (!this.gridApi) { return; }
    const selectedNodes = this.gridApi.getSelectedNodes();
    if (!selectedNodes || selectedNodes.length === 0) { return; }
    const id = selectedNodes[0].data._id;
    // pass id as URL segment

    this.commonService.deleteEntry(id, this.loggedInUser?.userName || '').subscribe({
      next: () => {
        this.getPatients(); // Refresh the list after deletion
      },
      error: (err) => {
        // Handle error, e.g., show a notification
      }
    });   
    // Implement client deletion logic here, e.g., show a confirmation dialog and call a delete API.
  }
  downloadPdf() {
    const filteredRowData: any[] = [];
    if (this.gridApi) {
      this.gridApi.forEachNodeAfterFilter((node: RowNode) => {
        filteredRowData.push(node.data);
      });
    }
    console.log('Filtered Row Data:', filteredRowData);
    const doc = new jsPDF();
    // add title and today's date at the top of the PDF
    doc.setFontSize(18);
    doc.text('Milk Bill', 14, 22);
    // avoid calling setFont with style to prevent TypeScript issues with typings;
    // emulate a subtitle by increasing font size slightly
    doc.setFontSize(12);
    doc.text(`Name: ${filteredRowData[0]?.Name || ''}`, 14, 26);

    doc.setFontSize(11);
    const today = new Date();
    doc.text(`Date: ${today.toLocaleDateString()}`, 14, 32);
    const total = filteredRowData.reduce((sum, item) => sum + (Number(item.Amount) || 0), 0);
    const formatted = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(total);
    doc.text(`Total Bill Amount: ${formatted}`, 14, 38);
    // leave space so autoTable doesn't overlap the header/title
    // pass this variable to autoTable calls as `startY: tableStartY`
    const tableStartY = 50;
    // build headers from columnDefs
    const headers = this.columnDefs.map(col => col.headerName || col.field || '');

    // build rows from rowData
    const body = (filteredRowData || [])
      
    .map((row) => this.columnDefs.map(col => {
        const value = row[col.field || ''] ?? '';
        return typeof value === 'string' ? value : String(value);
      }));
      
      
    // use the autoTable function (not doc.autoTable)
    autoTable(doc, {
      startY: tableStartY,
      head: [headers],
      body: body,
      theme: 'striped',
      styles: { fontSize: 10, cellPadding: 2 }
    });


    // compute sum of "Bill Amount" for the pathology rows and print it below the pathology table
    

    // compute sum of "Bill Amount" for the Hospital rows and print it below the hospital table
    

    doc.save(filteredRowData[0].Name + '_bills.pdf');
  }
//   clickMethod(name: string):void {
//   if(window.confirm("Are you sure you want to delete " + name + "?")) {
//     // Do nothing if user clicks "OK"
//   } else {
//     // Prevent deletion if user clicks "Cancel"
//     throw new Error("Deletion cancelled by user.");
//     return;
//   }
// }
}
