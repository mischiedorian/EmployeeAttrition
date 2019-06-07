import { Component, OnInit } from '@angular/core';
import {LoginService} from "../service/login.service";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor(private loginService: LoginService) { }

  ngOnInit() {
  }

  toggleActive(e) {
    const element = e.currentTarget;
    if(element.id == "1") {
      if(!element.classList.contains('active')) {
        element.classList.add('active');
        document.getElementById("admin").classList.remove('active');
      }
    } else if(element.id == "2") {
      if(!element.classList.contains('active')) {
        element.classList.add('active');
        document.getElementById("check-employee").classList.remove('active');
      }
    }
  }
}
