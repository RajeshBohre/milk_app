import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration/registration.component';
import { LoginPageComponent } from './registration/login-page/login-page.component';
import { ClientDetailsComponent } from './client-details/client-details.component';
import { BillAddEditComponent } from './bill-add-edit/bill-add-edit.component';
import { PaymentComponent } from './payment/payment/payment.component';


export const routes: Routes = [
    { path: 'login', component: LoginPageComponent },
  { path: 'registration', component: RegistrationComponent },
  {path: 'client-details', component: ClientDetailsComponent},
  {path: "add-client", component: BillAddEditComponent},
  {path: "edit-client/:id", component: BillAddEditComponent},
  { path: 'payment', component: PaymentComponent },
  { path: 'payment/:id', component: PaymentComponent },
  { path: '**', redirectTo: 'login' }
];
