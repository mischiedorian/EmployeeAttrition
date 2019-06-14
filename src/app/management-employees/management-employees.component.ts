import {Component, OnInit} from '@angular/core';
import {LoginService} from "../service/login.service";
import {ApiService} from "../service/api.service";
import {ToastrService} from "ngx-toastr";
import {EmployeeResponse} from "../models/response/employee-response";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-management-employees',
  templateUrl: './management-employees.component.html',
  styleUrls: ['./management-employees.component.css']
})
export class ManagementEmployeesComponent implements OnInit {

  employees: EmployeeResponse[] = [];
  counter: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  noOfPages: number = 0;

  constructor(private loginService: LoginService, private apiService: ApiService, private toast: ToastrService,
              private modalService: NgbModal) {
    this.currentPage = 1;
  }

  ngOnInit() {
    this.loginService.checkLoginPresence('/admin/management');
    this.getAllEmployees(this.currentPage, 10);
  };

  private deleteEmployee(e) {
    const id = e.currentTarget.className;
    const modalRef = this.modalService.open(ConfirmationDialogComponent, {size: 'lg'});

    modalRef.result.then((data) => {
      this.apiService.deleteEmployee(id).toPromise().then(
        res => {
          this.toast.success('Employee was successfully deleted');
          for (let i = 0; i < this.employees.length; i++) {
            if (this.employees[i]._id == id) {
              this.employees.splice(i, 1);
              if(this.employees.length === 0 && this.currentPage > 1) {
                this.removeList();
                this.getAllEmployees(--this.currentPage, this.itemsPerPage);
              }
            }
          }
        },
        err => {
          console.error(err);
          this.toast.error('Something went wrong', 'Server error')
        }
      );
    }, () => {
      // do nothing
    });
  }

  private nextPage() {
    this.currentPage++;
    this.refreshPage();
  }

  private previousPage() {
    this.currentPage--;
    this.refreshPage();
  }

  private generatePagination() {
    const parent = document.querySelector("#pagination li:first-child");
    let v1, v2, v3, v4, v5;

    if (this.currentPage <= 3) {
      v1 = 1;
      v2 = 2;
      v3 = 3;
      v4 = '...';
      v5 = this.noOfPages;
    } else if (this.currentPage >= this.noOfPages - 3) {
      v1 = 1;
      v2 = '...';
      v3 = this.noOfPages - 2;
      v4 = this.noOfPages - 1;
      v5 = this.noOfPages;
    } else {
      v1 = 1;
      v2 = '...';
      v3 = this.currentPage;
      v4 = '...';
      v5 = this.noOfPages;
    }

    parent.insertAdjacentHTML('afterend', `<li id="${v5}" class="page-item clickme"><div class="page-link">${v5}</div></li>`);
    parent.insertAdjacentHTML('afterend', `<li id="${v4}" class="page-item clickme"><div class="page-link">${v4}</div></li>`);
    parent.insertAdjacentHTML('afterend', `<li id="${v3}" class="page-item clickme"><div class="page-link">${v3}</div></li>`);
    parent.insertAdjacentHTML('afterend', `<li id="${v2}" class="page-item clickme"><div class="page-link">${v2}</div></li>`);
    parent.insertAdjacentHTML('afterend', `<li id="${v1}" class="page-item clickme"><div class="page-link">${v1}</div></li>`);

    document.getElementById(this.currentPage.toString()).classList.add('active');

    document.getElementById(`${v1}`).addEventListener('click', this.pageChange.bind(this));
    document.getElementById(`${v2}`).addEventListener('click', this.pageChange.bind(this));
    document.getElementById(`${v3}`).addEventListener('click', this.pageChange.bind(this));
    document.getElementById(`${v4}`).addEventListener('click', this.pageChange.bind(this));
    document.getElementById(`${v5}`).addEventListener('click', this.pageChange.bind(this));

  }

  private refreshPage() {
    this.removeList();
    this.getAllEmployees(this.currentPage, 10);
  }

  private removeList() {
    const list = document.querySelectorAll('#pagination li');
    for (let i = 1; i < 6; i++) {
      let li = list[i];
      li.parentNode.removeChild(li);
    }
  }

  private pageChange(e) {
    const page = Number(e.currentTarget.id);
    if (!isNaN(page)) {
      this.currentPage = page;
      this.refreshPage();
    }
  }

  private getAllEmployees(currentPage: number, totalPerPage: number) {
    this.apiService.getAllEmployees(currentPage, totalPerPage).toPromise().then(
      res => {
        this.employees = res.obj;
        this.counter = res.counter;
        this.noOfPages = Math.ceil(this.counter / this.itemsPerPage);
        this.generatePagination();
      },
      err => {
        console.error(err);
      }
    )
  }
}
