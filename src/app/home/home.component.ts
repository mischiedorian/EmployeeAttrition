import {Component, OnInit} from '@angular/core';
import {ApiService} from "../service/api.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ModalResponseComponent} from "../modal-response/modal-response.component";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  employeeModel: EmployeeModel = {
    age: 0,
    distanceFromHome: 0,
    education: 0,
    jobLevel: 0,
    monthlyIncome: 0,
    numCompaniesWorked: 0,
    totalWorkingYears: 0,
    trainingTimesLastYear: 0,
    yearsAtCompany: 0,
    yearsSinceLastPromotion: 0
  };

  attrition: AttritionResponse = {
    percentage: 0
  };

  constructor(private apiService: ApiService, private modalService: NgbModal, private toast: ToastrService) {
  }

  ngOnInit(): void {
  }

  sendData(): void {
    this.apiService.getAttrition(this.employeeModel).toPromise().then(
      res => {
        this.attrition = res.body;
        this.openResponseModal();
      },
      err => {
        console.error(err);
        this.toast.error('Something went wrong', 'Server Error');
      }
    )
  }

  openResponseModal() {
    const modalRef = this.modalService.open(ModalResponseComponent, {size: 'lg'});
    modalRef.componentInstance.attritionResponse = this.attrition;
  }
}

export interface EmployeeModel {
  age: number;
  distanceFromHome: number;
  education: number;
  jobLevel: number;
  monthlyIncome: number;
  numCompaniesWorked: number;
  totalWorkingYears: number;
  trainingTimesLastYear: number;
  yearsAtCompany: number;
  yearsSinceLastPromotion: number;
}

export interface AttritionResponse {
  percentage: number;
}
