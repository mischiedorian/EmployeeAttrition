import { Component, OnInit } from '@angular/core';
import {ApiService} from "../service/api.service";
import {Router} from "@angular/router";
import {LoginService} from "../service/login.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: LoginRequest = {
    username: '',
    password: ''
  };

  constructor(private apiService: ApiService, private loginService: LoginService,
              private router: Router) { }

  ngOnInit() {
    this.loginService.deleteAuthKey();
  }

  login() {
    this.apiService.login(this.model).toPromise().then(
        res => {
          if(res.status !== 200) {
            alert('An error has occurred when logging in');
          } else {
            this.loginService.setAuthKey("authorized");
            this.router.navigate(['/']);
          }
        },
        err => {alert('something went wrong'); }
    );
  }
}

export interface LoginRequest {
  username: string;
  password: string;
}
