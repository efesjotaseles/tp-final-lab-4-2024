import { Component } from '@angular/core';
import { BusquedaService } from '../../services/busqueda.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  buscado : string = '';
  constructor(private router: Router, private busquedaService: BusquedaService) {}
  enviarBusqueda() {
    if (this.buscado.trim()) {
      this.busquedaService.actualizarBusqueda(this.buscado);
      this.router.navigate(['/busqueda']);
    }
  }

}
