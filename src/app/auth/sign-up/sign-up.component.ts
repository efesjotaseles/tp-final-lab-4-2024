import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})

export class SignUpComponent {

  signUpForm: FormGroup;
  name: string = '';
  lastName: string = '';
  email: string = '';
  username: string = '';
  password: string = '';
  confirmPassword: string = '';


  //constructor(private authService: AuthService) {}
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signUpForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñ\s]+$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñ\s]+$/)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+com$/)], this.emailExistsValidator.bind(this)],
      username: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9.-]+$/)], this.usernameExistsValidator.bind(this)],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', [Validators.required]],
      terms: [false, Validators.requiredTrue],
    }, {
      
    });
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    return password && confirmPassword && password.value !== confirmPassword.value
      ? { passwordsMismatch: true }
      : null;
  };

  emailExistsValidator(control: AbstractControl) {
    return this.authService.checkEmailExists(control.value).pipe(
      map(exists => (exists ? { emailExists: true } : null))
    );
  }

  usernameExistsValidator(control: AbstractControl) {
    return this.authService.checkUsernameExists(control.value).pipe(
      map(exists => (exists ? { usernameExists: true } : null))
    );
  }

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (this.signUpForm.valid) {
      const newUser = this.signUpForm.value;
      this.authService.register(newUser).subscribe(
        (response) => {
          alert("Registration successful!");
          this.router.navigate(['/home']);
        },
        (error) => {
          alert("Registration failed!");
          console.error(error);
        }
      );
    }
  }
}