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
          rating: [],
          comments: []
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
    // Actualiza el BehaviorSubject
    this.loggedInUserSubject.next(updatedUser);
    // Actualiza el usuario en localStorage
    localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
  }

  addComment(userId: number, comment: { id: number; movieId: number; text: string; date: string }): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/users/${userId}`).pipe(
      switchMap(user => {
        const updatedComments = user.comments ? [...user.comments, comment] : [comment];
        return this.http.patch(`http://localhost:3000/users/${userId}`, { comments: updatedComments });
      })
    );
  }

  getCurrentComments(userId: string): any[] {
    const user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    return user?.comments || [];
  }

  addRating(userId: number, rating: { id: number, movieId: number, number: number }): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`).pipe(
      switchMap(user => {
        // Si ya tiene ratings, lo agregamos al array. Si no, lo inicializamos.
        const updatedRatings = user.rating ? [...user.rating, rating] : [rating];
        return this.http.patch(`${this.apiUrl}/${userId}`, { rating: updatedRatings });
      })
    );
  }

  getCurrentRatings(userId: string): any[] {
    const user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    return user?.ratings || [];
  }
}