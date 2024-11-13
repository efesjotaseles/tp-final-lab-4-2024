import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';
  private loggedInUserSubject = new BehaviorSubject<any>(this.getLoggedInUser());
  loggedInUser$ = this.loggedInUserSubject.asObservable();

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<boolean> {
    return this.http.get<any[]>(`${this.apiUrl}?username=${username}&password=${password}`).pipe(
      map(users => {
        if (users.length > 0) {
          const user = users[0];
          localStorage.setItem('loggedInUser', JSON.stringify(user));
          this.loggedInUserSubject.next(user);  // Actualiza el BehaviorSubject
          return true;
        }
        return false;
      }),
      catchError(() => of(false))
    );
  }

  logout() {
    localStorage.removeItem('loggedInUser');
    this.loggedInUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('loggedInUser') !== null;
  }

  getLoggedInUser(): any {
    const user = localStorage.getItem('loggedInUser');
    return user ? JSON.parse(user) : null;
  }

  register(newUser: any): Observable<any> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(users => {
        // Buscar el mayor id actual y asignar el nuevo id
        const maxId = users.reduce((max, user) => (user.id > max ? user.id : max), 0);
        const fullUser = {
          ...newUser,
          id: maxId + 1,
          avatar: "",
          watchlist: [],
          likes: [],
          watched: [],
          rating: [{
            id: "",
            movieId: "",
            number: ""
          }],
          comments: [{
            id: "",
            movieId: "",
            text: ""
          }]
        };
        delete fullUser.confirmPassword;
        delete fullUser.terms;
        return fullUser;
      }),

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