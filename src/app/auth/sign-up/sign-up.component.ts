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
      validators: this.passwordMatchValidator 
    });
  }
  

  passwordMatchValidator(group: FormGroup): ValidationErrors | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordsMismatch: true }); 
      return { passwordsMismatch: true }; 
    }
  
    if (confirmPassword && confirmPassword.hasError('passwordsMismatch')) {
      confirmPassword.setErrors(null); 
    }
  
    return null;
  }
  
  
  
  

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
    if (this.signUpForm.invalid) {
      return;
    }
  
    if (this.signUpForm.hasError('passwordsMismatch')) {
      alert("Las contraseñas no coinciden!");
      return;
    }
  
    if (this.signUpForm.valid) {
      const newUser = this.signUpForm.value;
      this.authService.register(newUser).subscribe(
        (response) => {
          alert("¡Registro exitoso!");
          this.router.navigate(['/home']);
        },
        (error) => {
          alert("¡Error en el registro!");
          console.error(error);
        }
      );
    }
  }
  
  
}