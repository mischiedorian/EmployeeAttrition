import { Component, OnInit } from '@angular/core';
import {LoginService} from "../service/login.service";
import {ApiService} from "../service/api.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  employees: EmployeeResponse[] = [];

  constructor(private loginService: LoginService, private apiService: ApiService) { }

  ngOnInit() {
    this.loginService.checkLoginPresence('/');
    this.apiService.getAllEmployees().toPromise().then(
        res => {
          this.employees = JSON.parse(res);
        },
        err => {
          console.error(err);
        }
    )
  };

  deleteEmployee(id: string) {
    this.apiService.deleteEmployee(id).toPromise().then(
        res => {
          alert("done");
           console.log("s-a sters");
        },
        err => {
          console.error(err);
        }
    );
  }
}

export interface EmployeeResponse {
  id: string;
  age: number;
  distance_from_home: number;
  education: number;
  job_level: number;
  monthly_income: number;
  num_companies_worked: number;
  total_working_years: number;
  training_times_last_year: number;
  years_at_company: number;
  years_since_last_promotion: number;
  attrition: string
}