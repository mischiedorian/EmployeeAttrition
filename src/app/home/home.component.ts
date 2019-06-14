import {Component, OnInit} from '@angular/core';
import {ApiService} from "../service/api.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ModalResponseComponent} from "../modal-response/modal-response.component";
import {ToastrService} from "ngx-toastr";
import {AttritionResponse} from "../models/response/attrition-response";
import {EmployeeModel} from "../models/employee-model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  employeeModel: EmployeeModel = {
    age: null,
    distanceFromHome: null,
    education: null,
    jobLevel: null,
    monthlyIncome: null,
    numCompaniesWorked: null,
    totalWorkingYears: null,
    trainingTimesLastYear: null,
    yearsAtCompany: null,
    yearsSinceLastPromotion: null
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

