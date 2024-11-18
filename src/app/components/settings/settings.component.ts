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
  settingsForm!: FormGroup;
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

    this.settingsForm = this.fb.group({
      name: [
        loggedInUser.name || '',
        [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñ\s]+$/)],
      ],
      lastname: [ // Cambiar "lastName" a "lastname"
        loggedInUser.lastname || '', // Cambiar "loggedInUser.lastName" a "loggedInUser.lastname"
        [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñ\s]+$/)],
      ],
      email: [
        loggedInUser.email || '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[\w-\.]+@([\w-]+\.)+com$/),
        ],
        this.emailExistsValidator.bind(this),
      ],
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

  updateSettings(): void {
    if (this.settingsForm.invalid) return;

    const loggedInUser = this.authService.getLoggedInUser();
    const updatedUser = {
      ...loggedInUser,
      ...this.settingsForm.value,
    };

    this.authService.updateUser(updatedUser).subscribe((response) => {
      if (response) {
        this.message = '¡Datos actualizados correctamente!';
        this.success = true;
      } else {
        this.message = 'Error al actualizar los datos. Intenta nuevamente.';
        this.success = false;
      }

      // Limpiar mensaje después de 5 segundos
      setTimeout(() => {
        this.message = '';
      }, 5000);
    });
  }

  emailExistsValidator(control: any) {
    return this.authService.checkEmailExists(control.value).pipe(
      map((exists) => (exists ? { emailExists: true } : null))
    );
  }
}
