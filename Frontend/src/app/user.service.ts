import { Injectable } from '@angular/core';
import { User } from './user';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  mergeMap,
  of,
  tap,
} from 'rxjs';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  allUsers: User[] = [];

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private domSanitizer: DomSanitizer
  ) {}

  private serverNodeUrl = 'http://appserver.alunos.di.fc.ul.pt:3058';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
  };

  private currentUsernameSource = new BehaviorSubject<string | null>(null);
  currentUsername$ = this.currentUsernameSource.asObservable();

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.serverNodeUrl}/login`, this.httpOptions);
  }

  getCurrentUserName(): Observable<string> {
    return this.http
      .get<User>(`${this.serverNodeUrl}/login`, this.httpOptions)
      .pipe(map((user) => user.name));
  }

  registerUser(user: User): Observable<String> {
    return this.http
      .post<User>(this.serverNodeUrl + '/users', user, this.httpOptions)
      .pipe(
        mergeMap((newUser) => {
          if (this.existsUser(newUser.name)) {
            return of('Sucesso');
          } else {
            return of('Internal Server error');
          }
        })
      );
  }

  login(name: string, password: string): Observable<User> {
    const payload = { name, password };
    return this.http
      .post<User>(`${this.serverNodeUrl}/login`, payload, this.httpOptions)
      .pipe(tap((user) => this.currentUserSubject.next(user)));
  }

  routeHere(path: string) {
    this.router.navigate([path]);
  }

  existsUser(username: string): Observable<boolean> {
    const dbUserObservable: Observable<User> = this.http.get<User>(
      this.serverNodeUrl + `/user/${username}`,
      this.httpOptions
    );

    return dbUserObservable.pipe(
      map((user) => true),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return of(false);
        } else {
          throw error;
        }
      })
    );
  }

  getUser(name: string): Observable<User> {
    return this.http
      .get<User>(this.serverNodeUrl + '/user/' + name, this.httpOptions)
      .pipe(
        map((user) => {
          return user;
        }),
        catchError((error: HttpErrorResponse) => {
          throw error;
        })
      );
  }

  logout(): Observable<any> {
    return this.http.get(`${this.serverNodeUrl}/logout`, this.httpOptions).pipe(
      tap(() => {
        // Atualize o BehaviorSubject para null após o logout bem-sucedido
        this.currentUserSubject.next(null);
      }),
      catchError((error: HttpErrorResponse) => {
        throw error;
      })
    );
  }

  getUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(this.serverNodeUrl + '/users', this.httpOptions)
      .pipe(
        map((users) => {
          return users;
        }),
        catchError((error: HttpErrorResponse) => {
          throw error;
        })
      );
  }

  followUser(pageUser: string, payload: any) {
    return this.http.post(
      this.serverNodeUrl + '/follow/' + pageUser,
      payload,
      this.httpOptions
    );
  }
  unfollowUser(pageUser: string, payload: any) {
    return this.http.post(
      this.serverNodeUrl + '/unfollow/' + pageUser,
      payload,
      this.httpOptions
    );
  }

  checkUsernameAvailability(username: string): Observable<boolean> {
    return this.http
      .get<boolean>(
        `${this.serverNodeUrl}/username-availability/${username}`,
        this.httpOptions
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            return of(true);
          } else {
            throw error;
          }
        })
      );
  }

  updateProfile(newUsername: string | null): Observable<any> {
    return this.getCurrentUserName().pipe(
      mergeMap((currentUsername) => {
        const payload = {
          currentUsername,
          newUsername,
        };

        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
          withCredentials: true,
        };

        return this.http
          .patch(
            `${this.serverNodeUrl}/editprofile/` +
              currentUsername +
              `/editname`,
            payload,
            httpOptions
          )
          .pipe(
            tap(() => {
              if (newUsername) {
                const currentUser = this.currentUserSubject.value;
                if (currentUser) {
                  currentUser.name = newUsername;
                  this.currentUserSubject.next(currentUser);
                  this.updateCurrentUsername(newUsername); // Adicione esta linha
                }
              }
            })
          );
      })
    );
  }

  updateCurrentUsername(newUsername: string) {
    const currentUser = this.currentUserSubject.value;
    if (currentUser) {
      currentUser.name = newUsername;
      this.currentUserSubject.next(currentUser);
      this.currentUsernameSource.next(newUsername);
    }
  }

  updateProfileIcon(iconUrl: string): Observable<any> {
    console.log('entrou no updateprofileIcon');
    return this.getCurrentUserName().pipe(
      mergeMap((currentUsername) => {
        const payload = {
          currentUsername,
          newProfilePicture: iconUrl,
        };

        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
          withCredentials: true,
        };

        return this.http
          .patch(
            `${this.serverNodeUrl}/editprofile/` +
              currentUsername +
              `/editpicture`,
            payload,
            httpOptions
          )
          .pipe(
            tap(() => {
              const currentUser = this.currentUserSubject.value;
              if (currentUser) {
                currentUser.profilePicture = iconUrl;
                this.currentUserSubject.next(currentUser);
              }
            }),
            catchError((error: HttpErrorResponse) => {
              throw error;
            })
          );
      })
    );
  }
  getItemPreco(item:string){
    return this.http.get<number>(`${this.serverNodeUrl}/itemprice/${item}`,this.httpOptions);
  }

  removeItems(itemList: string[]): Observable<any> {
    const url = `${this.serverNodeUrl}/user/cart`;
    return this.http.delete(url,this.httpOptions);
  }
}
