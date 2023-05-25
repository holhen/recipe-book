import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, catchError, tap, throwError } from "rxjs";
import { User } from "./user.model";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    localId: string;
    expiresIn: string;
    registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
    user = new BehaviorSubject<User | null>(null);
    private tokenExpirationTimer = 0;

    constructor(private http: HttpClient,
                private router: Router) {}

    signup(email: string, password: string): Observable<AuthResponseData> {
        return this.http.post<AuthResponseData>(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${environment.firebaseAPIKey}`, {
            email,
            password,
            returnSecureToken: true
        }).pipe(catchError(this.handleError), 
            tap(resData => {
               this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
            }));
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${environment.firebaseAPIKey}`, {
            email,
            password,
            returnSecureToken: true
        }).pipe(catchError(this.handleError),
            tap(resData => {
                this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
            }));
    }

    autoLogin() {
        const userString = localStorage.getItem('userData');
        if(!userString) {
            return;
        }

        const userObject: {
            email: string, 
            id: string, 
             _token: string, 
             _tokenExpirationDate: string
        } = JSON.parse(userString);

        const loadedUser = new User(userObject.email, userObject.id, userObject._token, new Date(userObject._tokenExpirationDate));

        if(loadedUser.token) {
            this.user.next(loadedUser);
            const expirationDuration = new Date(userObject._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = 0;
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = window.setTimeout(() => {
            this.logout();
        }, expirationDuration)
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(email, userId, token, expirationDate);
        this.user.next(user);
        this.autoLogout(expiresIn * 1000)
        localStorage.setItem('userData', JSON.stringify(user))
    }

    private handleError(errorResponse: HttpErrorResponse) {
        let errorMessage = "An unknown error occured";
        switch(errorResponse.error?.error?.message) {
            case 'EMAIL_EXISTS': {
              errorMessage = "This email already exists.";
              break;
            }
            case 'EMAIL_NOT_FOUND': {
                errorMessage = "This email does not exist.";
                break;
            }
            case 'INVALID_PASSWORD': {
                errorMessage = "Password is invalid.";
                break;
            }
        }
        return throwError(() => new Error(errorMessage))
    }
}