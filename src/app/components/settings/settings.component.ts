import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  nameForm!: FormGroup;
  lastNameForm!: FormGroup;
  emailForm!: FormGroup;
  passwordForm!: FormGroup;
  message: string = '';
  success: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const loggedInUser = this.authService.getLoggedInUser();
    if (!loggedInUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.nameForm = this.fb.group({
      name: [
        loggedInUser.name || '',
        [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñ\s]+$/)],
      ],
    });

    this.lastNameForm = this.fb.group({
      lastName: [
        loggedInUser.lastName || '',
        [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñ\s]+$/)],
      ],
    });

    this.emailForm = this.fb.group({
      email: [
        loggedInUser.email || '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[\w-\.]+@([\w-]+\.)+com$/),
        ],
        this.emailExistsValidator.bind(this),
      ],
    });

    this.passwordForm = this.fb.group({
      currentPassword: [
        '',
        [Validators.required, this.validateCurrentPassword.bind(this)],
      ],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  validateCurrentPassword(control: any) {
    const loggedInUser = this.authService.getLoggedInUser();
    return control.value === loggedInUser.password
      ? null
      : { incorrectPassword: true };
  }

  updateName(): void {
    if (this.nameForm.invalid) return;
    this.updateField('name', this.nameForm.value);
  }

  updateLastName(): void {
    if (this.lastNameForm.invalid) return;
    this.updateField('lastName', this.lastNameForm.value);  
  }

  updateEmail(): void {
    if (this.emailForm.invalid) return;
    this.updateField('email', this.emailForm.value);
  }

  updatePassword(): void {
    if (this.passwordForm.invalid) return;
    this.updateField('password', this.passwordForm.value);
  }

  updateField(field: string, value: any): void { 
    const loggedInUser = this.authService.getLoggedInUser();
    const updatedUser = { ...loggedInUser, ...value };
  
    this.authService.updateUser(updatedUser).subscribe((response) => {
      console.log('Response from updateUser:', response); // Verifica la respuesta
  
      if (response) {
        this.message = `${field.charAt(0).toUpperCase() + field.slice(1)} actualizado correctamente!`;
        this.success = true;
      } else {
        this.message = `Error al actualizar ${field}. Intenta nuevamente.`;
        this.success = false;
      }
    }, (error) => {
      console.error('Error during update:', error); // Captura cualquier error en la llamada
      this.message = `Error al actualizar ${field}. Intenta nuevamente.`;
      this.success = false;
    });
  }
  

  emailExistsValidator(control: any) {
    return this.authService
      .checkEmailExists(control.value)
      .pipe(map((exists: boolean) => (exists ? { emailExists: true } : null)));
  }
}