import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration/registration.component';
import { LoginPageComponent } from './registration/login-page/login-page.component';
import { ClientDetailsComponent } from './client-details/client-details.component';
import { BillAddEditComponent } from './bill-add-edit/bill-add-edit.component';
import { PaymentComponent } from './payment/payment/payment.component';
import { KiranaClientDetailsComponent } from './kirana-client/kirana-client.component';
import { AddEditKiranaClientComponent } from './add-edit-kirana-client/add-edit-kirana-client.component';


export const routes: Routes = [
    { path: 'login', component: LoginPageComponent },
  { path: 'registration', component: RegistrationComponent },
  {path: 'client-details', component: ClientDetailsComponent},
  {path: "add-client", component: BillAddEditComponent},
  {path: "edit-client/:id", component: BillAddEditComponent},
  { path: 'payment', component: PaymentComponent },
  { path: 'payment/:id', component: PaymentComponent },
  { path: 'kirana-client-details', component: KiranaClientDetailsComponent },
  { path: 'add-kirana-client', component: AddEditKiranaClientComponent },
  { path: 'edit-kirana-client/:id', component: AddEditKiranaClientComponent },
  { path: '**', redirectTo: 'login' }
];
