import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.css']
})
export class AdminSettingsComponent implements OnInit {

  users: any[] = []; 
  comments: any[] = []; 

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loadUsers();     
    this.loadComments();  
  }

  loadUsers(): void {
    this.authService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  loadComments(): void {
    this.authService.getComments().subscribe(comments => {
      this.comments = comments;
    });
  }

  deleteUser(userId: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.authService.deleteUser(userId).subscribe(() => {
        alert('Usuario eliminado correctamente');
        this.loadUsers(); 
      }, error => {
        alert('Hubo un error al eliminar el usuario');
        console.error(error);
      });
    }
  }

  deleteComment(commentId: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este comentario?')) {
      this.authService.deleteComment(commentId).subscribe(() => {
        alert('Comentario eliminado correctamente');
        this.loadComments(); 
      }, error => {
        alert('Hubo un error al eliminar el comentario');
        console.error(error);
      });
    }
  }
}
