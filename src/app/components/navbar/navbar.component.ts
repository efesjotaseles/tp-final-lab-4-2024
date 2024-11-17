import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { BusquedaService } from '../../services/busqueda.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  standalone: false,
})
export class NavbarComponent implements OnInit {

  buscado: string = '';
  loggedInUser: any = null;

  constructor(private router: Router, private busquedaService: BusquedaService, public authService: AuthService, private cd: ChangeDetectorRef) { }

  enviarBusqueda() {
    if (this.buscado.trim()) {
      this.busquedaService.actualizarBusqueda(this.buscado);
      this.router.navigate(['/busqueda']);
    }
  }

  ngOnInit(): void {
    this.authService.loggedInUser$.subscribe(user => {
      this.loggedInUser = user;
    });
  }

  logout() {
    this.authService.logout();  // Llamamos al método logout del AuthService
    this.router.navigate(['/login']);
  }
  // loadUser() {
  //   const user = localStorage.getItem('loggedInUser');
  //   if (user) {
  //     try {
  //       this.loggedInUser = JSON.parse(user);
  //       console.log(this.loggedInUser);
  //     } catch (e) {
  //       console.error('Error al parsear el usuario desde localStorage', e);
  //       this.loggedInUser = null;
  //     }
  //   } else {
  //     this.loggedInUser = null;
  //   }
  // }
  // logout() {
  //   this.authService.logout();
  //   localStorage.removeItem('loggedInUser');
  //   this.router.navigate(['/login']);
  // }

}
