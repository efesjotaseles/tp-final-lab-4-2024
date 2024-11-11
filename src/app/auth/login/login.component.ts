import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl:'./login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onLogin() {
    this.authService.login(this.username, this.password).subscribe(
      isAuthenticated => {
        if (isAuthenticated) {
          this.successMessage = 'Ingreso exitoso'; 
          this.errorMessage = ''; 
          setTimeout(() => {
            this.router.navigate(['/home']); 
          }, 1000);
        } else {
          this.errorMessage = 'Usuario o contraseña incorrectos';
          this.successMessage = ''; 
        }
      },
      error => {
        console.error("Error al intentar autenticar:", error);
        this.errorMessage = 'Hubo un problema con el inicio de sesión';
        this.successMessage = ''; 
      }
    );
  }
}