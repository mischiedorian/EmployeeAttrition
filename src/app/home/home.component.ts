import {Component, OnInit} from '@angular/core';
import {ApiService} from "../service/api.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ModalResponseComponent} from "../modal-response/modal-response.component";
import {ToastrService} from "ngx-toastr";
import {AttritionResponse} from "../models/response/attrition-response";
import {EmployeeModel} from "../models/employee-model";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  minAge = 18;
  maxAge = 65;
  minMonthlyIncome = 2500;

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

  form = new FormGroup({
    age: new FormControl('', [Validators.required, Validators.min(this.minAge), Validators.max(this.maxAge)]),
    distanceFromHome: new FormControl('', [Validators.required, Validators.min(0)]),
    education: new FormControl('', [Validators.required]),
    jobLevel: new FormControl('', [Validators.required]),
    monthlyIncome: new FormControl('', [Validators.required, Validators.min(this.minMonthlyIncome)]),
    numCompaniesWorked: new FormControl('', [Validators.required, Validators.min(0)]),
    totalWorkingYears: new FormControl('', [Validators.required, Validators.min(0)]),
    trainingTimesLastYear: new FormControl('', [Validators.required, Validators.min(0)]),
    yearsAtCompany: new FormControl('', [Validators.required, Validators.min(0)]),
    yearsSinceLastPromotion: new FormControl('', [Validators.required, Validators.min(0)])
  });

  attrition: AttritionResponse = {
    percentage: 0
  };

  constructor(private apiService: ApiService, private modalService: NgbModal, private toast: ToastrService) {
  }

  ngOnInit(): void {
  }

  sendData(): void {
    this.employeeModel = this.form.value;
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

