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
    this.authService.logout(); 
    this.router.navigate(['/login']);
  }

}
