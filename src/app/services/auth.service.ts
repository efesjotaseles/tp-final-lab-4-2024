import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';
  private commentsUrl = 'http://localhost:3000/comments';
  private ratingsUrl = 'http://localhost:3000/ratings';

  private loggedInUserSubject = new BehaviorSubject<any>(this.getLoggedInUser());
  loggedInUser$ = this.loggedInUserSubject.asObservable();

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<boolean> {
    return this.http.get<any[]>(`${this.apiUrl}?username=${username}&password=${password}`).pipe(
      map(users => {
        if (users.length > 0) {
          const user = users[0];
          localStorage.setItem('loggedInUser', JSON.stringify(user));
          this.loggedInUserSubject.next(user); 
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

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }

  getComments(): Observable<any[]> {
    return this.http.get<any[]>(this.commentsUrl);
  }

  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(`${this.commentsUrl}/${commentId}`);
  }

  register(newUser: any): Observable<any> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(users => {
        const maxId = users.reduce((max, user) => {
          const userId = parseInt(user.id, 10);
          return userId > max ? userId : max;
        }, 0);
  
        const fullUser = {
          ...newUser,
          id: (maxId + 1).toString(),
          avatar: "",
          likes: [],
          watched: [],
          watchlist: []
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

  updateUser(updatedUser: any): Observable<any> {
    console.log('Actualizando usuario:', updatedUser);
    return this.http.put(`${this.apiUrl}/${updatedUser.id}`, updatedUser).pipe(
      map(user => {
        const loggedInUser = this.getLoggedInUser();
        if (loggedInUser && loggedInUser.id === updatedUser.id) {
          localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
          this.loggedInUserSubject.next(updatedUser);
        }
        return user;
      }),
      catchError(error => {
        console.error('Error al actualizar el usuario:', error);
        return of(null);
      })
    );
  }

  updateLoggedInUser(updatedUser: any): void {
    this.loggedInUserSubject.next(updatedUser);
    localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
  }
}