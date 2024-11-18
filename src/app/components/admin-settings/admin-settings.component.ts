import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.css']
})
export class AdminSettingsComponent implements OnInit {

  users: any[] = [];  // Para almacenar la lista de usuarios

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loadUsers();  // Cargar la lista de usuarios al iniciar el componente
  }

  // Método para cargar los usuarios desde el servicio
  loadUsers(): void {
    this.authService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  // Método para eliminar un usuario
  deleteUser(userId: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.authService.deleteUser(userId).subscribe(response => {
        alert('Usuario eliminado correctamente');
        this.loadUsers();  // Recargar la lista de usuarios
      }, error => {
        alert('Hubo un error al eliminar el usuario');
        console.error(error);
      });
    }
  }

}
