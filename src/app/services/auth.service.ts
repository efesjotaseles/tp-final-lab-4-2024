import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<boolean> {
    return this.http.get<any[]>(`${this.apiUrl}?username=${username}&password=${password}`).pipe(
      map(users => {
        return users.length > 0;
      }),
      catchError(() => of(false))
    );
  }

  logout() {
    localStorage.removeItem('loggedInUser');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('loggedInUser') !== null;
  }

  register(newUser: any): Observable<any> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(users => {
        // Buscar el mayor id actual
        const maxId = users.reduce((max, user) => user.id > max ? user.id : max, 0);
        newUser.id = maxId + 1; // Asignar el nuevo id incrementado
        return newUser;
      }),
      // Luego, realizar el POST con el usuario actualizado
      switchMap(userWithId => this.http.post(this.apiUrl, userWithId))
    );
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<any[]>(`${this.apiUrl}?email=${email}`).pipe(
      map(users => users.length > 0)
    );
  }

  checkUsernameExists(username: string): Observable<boolean> {
    return this.http.get<any[]>(`${this.apiUrl}?username=${username}`).pipe(
      map(users => users.length > 0)
    );
  }
}