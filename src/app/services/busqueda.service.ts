import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusquedaService {
  private valorBuscadoSource = new BehaviorSubject<string>('');
  buscado$ = this.valorBuscadoSource.asObservable();

  actualizarBusqueda(valor: string) {
    this.valorBuscadoSource.next(valor);
  }
}
