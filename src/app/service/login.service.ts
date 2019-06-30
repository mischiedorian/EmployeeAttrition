import {Injectable} from "@angular/core";
import {Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    public KEY = 'Auth';

    constructor(private router: Router) {}

    checkLoginPresence(currentLocation: string) {
        const login = window.sessionStorage.getItem(this.KEY);
        if(login === undefined || login === '' || login === null) {
            this.router.navigate(['/admin/login']);
        } else {
            this.router.navigate([currentLocation])
        }
    }

    setAuthKey(user: string) {
        window.sessionStorage.setItem(this.KEY, user);
    }

    deleteAuthKey() {
        window.sessionStorage.setItem(this.KEY, '');
    }

    isLoginPage(): boolean {
        return window.location.pathname === '/admin/login';
    }
}
