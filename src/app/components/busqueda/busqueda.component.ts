import { Component, OnInit } from '@angular/core';
import { BusquedaService } from '../../services/busqueda.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css'] // Cambiado a 'styleUrls'
})
export class BusquedaComponent implements OnInit{

  valorBuscado: string = '';

  constructor(private busquedaService: BusquedaService) { }

  ngOnInit(): void {
    this.busquedaService.buscado$.subscribe((valor)=>{
      this.valorBuscado = valor;
    })
  }

}
