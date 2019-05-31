import {Injectable} from "@angular/core";
import {Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    public KEY = 'Auth';

    constructor(private router: Router) {}

    checkLoginPresence(currentLocation: string) {
        const login = window.localStorage.getItem(this.KEY);
        if(login === undefined || login === '' || login === null) {
            this.router.navigate(['/admin/login']);
        } else {
            this.router.navigate([currentLocation])
        }
    }

    setAuthKey(user: string) {
        window.localStorage.setItem(this.KEY, user);
    }

    deleteAuthKey() {
        window.localStorage.setItem(this.KEY, '');
    }
}
