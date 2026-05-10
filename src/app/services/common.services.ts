import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
    providedIn: 'root'
})
export class CommonService {
    // baseUrl should point to your backend (set in environment.ts)
    //private baseUrl: string = 'http://localhost:8084/api';
    private baseUrl: string = 'https://hisabkitab-backend.onrender.com/api';
    private messageSource = new Subject<boolean>();
    //dns1.p05.nsone.net
    //dns2.p05.nsone.net
    //dns3.p05.nsone.net
    //dns4.p05.nsone.net
  // Expose as Observable so components can't call .next() directly
  message$ = this.messageSource.asObservable();
    constructor(private http: HttpClient) {}
    userRegister(req: any): Observable<any> {
        const url = `${this.baseUrl}/userInsert`; // adjust route to match your backend
        //const body = { id, update };
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.post<any>(url, req, { headers }).pipe(
            catchError(this.handleError)
        );
    }
    /**
     * Update a document in MongoDB via backend POST endpoint.
     * - collection: name of the collection (or route) the backend expects
     * - id: identifier of the document to update
     * - update: partial object with fields to update (or any payload your backend expects)
     *
     * Example backend expected payload:
     * { id: '...', update: { fieldA: 'newValue' } }
     */
    sendMessage(message: boolean) {
    this.messageSource.next(message);
  }
    updateEntry(req: any): Observable<any> {
        const url = `${this.baseUrl}/updateEntry`; // adjust route to match your backend
        //const body = { id, update };
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.patch<any>(url, req, { headers }).pipe(
            catchError(this.handleError)
        );
    }
    createEntry(req: any): Observable<any> {
        const url = `${this.baseUrl}/insertEntry`; // adjust route to match your backend
        //const body = { id, update };
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.post<any>(url, req, { headers }).pipe(
            catchError(this.handleError)
        );
    }
    createNewCustomer(req: any): Observable<any> {
        const url = `${this.baseUrl}/insertCustomer`; // adjust route to match your backend
        //const body = { id, update };
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.post<any>(url, req, { headers }).pipe(
            catchError(this.handleError)
        );
    }
    getCustomerCount(req: any): Observable<any> {
        const url= `${this.baseUrl}/getCustomerCount/${req.userName}`; // adjust route to match your backend
        return this.http.get<any>(url).pipe(
            catchError(this.handleError)
        );
    }
    getCustomer(req: any): Observable<any> {
        const url = `${this.baseUrl}/getCustomer/${req.userName}`; // adjust route to match your backend
        return this.http.get<any>(url).pipe(
            catchError(this.handleError)
        );
    }   
    createKiranaEntry(req: any): Observable<any> {
        const url = `${this.baseUrl}/insertKiranaEntry`; // adjust route to match your backend
        //const body = { id, update };
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.post<any>(url, req, { headers }).pipe(
            catchError(this.handleError)
        );
    }
    updateKiranaEntry(req: any): Observable<any> {
        const url = `${this.baseUrl}/updateKiranaEntry`; // adjust route to match your backend
        //const body = { id, update };
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.patch<any>(url, req, { headers }).pipe(
            catchError(this.handleError)
        );
    }
    deleteEntry(id: string, userName: string): Observable<any> {
        const url = `${this.baseUrl}/entryDelete/${id}`; // adjust route to match your backend
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.delete<any>(url, { headers, body: { userName } }).pipe(
            catchError(this.handleError)
        );
    }
    deleteKiranaEntry(id: string, userName: string): Observable<any> {
        const url = `${this.baseUrl}/kiranaEntryDelete/${id}`; // adjust route to match your backend
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.delete<any>(url, { headers, body: { userName } }).pipe(
            catchError(this.handleError)
        );
    }
    paymentEntry(req:any): Observable<any> {
        const url = `${this.baseUrl}/paymentEntry`;
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<any>(url, req, { headers }).pipe(
            catchError(this.handleError)
        );
    }
    insertInventoryEntry(req:any): Observable<any> {
        const url = `${this.baseUrl}/insertInventory`;
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<any>(url, req, { headers }).pipe(
            catchError(this.handleError)
        );
    }
    getPaymentDetails(req: any): Observable<any> {
        const url = `${this.baseUrl}/getPaymentEntry/${req.userName}`; // adjust route to match your backend
        return this.http.get<any>(url).pipe(
            catchError(this.handleError)
        );
    }
    getDetailsMilkMan(req: any): Observable<any> {
        const url = `${this.baseUrl}/getEntry/${req.userName}`; // adjust route to match your backend
        return this.http.get<any>(url).pipe(
            catchError(this.handleError)
        );
    }
    getDetailsKirana(req: any): Observable<any> {
        const url = `${this.baseUrl}/getKiranaEntry/${req.userName}`; // adjust route to match your backend
        return this.http.get<any>(url).pipe(
            catchError(this.handleError)
        );
    }
    private handleError(error: any) {
        // minimal error normalization — adapt as needed
        const err = error?.error || error?.message || error;
        return throwError(() => err);
    }
    getUser(): Observable<any> {
        const url = `${this.baseUrl}/getUser`; // adjust route to match your backend
        return this.http.get<any>(url).pipe(
            catchError(this.handleError)
        );
    }
    setLoggedInUser(user: any) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
    }
    getLoggedInUser(): any {
        const userJson = localStorage.getItem('loggedInUser');
        return userJson ? JSON.parse(userJson) : null;
    }  
    setLoggedInSuccess(isSuccess: boolean) {
        localStorage.setItem('isLoginSuccess', JSON.stringify(isSuccess));
    }
    getLoggedInSuccess(): boolean {
        const successJson = localStorage.getItem('isLoginSuccess');
        return successJson ? JSON.parse(successJson) : false;
    } 
    getPaymentHistory(req: any): Observable<any> {
        const url = `${this.baseUrl}/getPaymentEntry/${req.userName}`; // adjust route to match your backend
        return this.http.get<any>(url).pipe(
            catchError(this.handleError)
        );
    }
}