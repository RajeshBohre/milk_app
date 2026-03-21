import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'milk-app';
  path:any;
  isValidated: boolean = false;
  loginForm: any;
  loading = false;
  submitted = false;
  formBuilder: any;
  userName: any;
  password: any;
  isRegistration: boolean = false;
  constructor(private router: Router) {}
  ngOnInit(): void {
      
    }
    
}
