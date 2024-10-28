import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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
}