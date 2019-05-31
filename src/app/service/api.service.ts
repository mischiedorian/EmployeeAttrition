import {Injectable} from "@angular/core";
import {LoginRequest} from "../login/login.component";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {EmployeeResponse} from "../home/home.component";

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private BASE_URL = 'http://localhost:5000';
    private ATTRITION = `${this.BASE_URL}/attrition`;
    private EMPLOYEES = `${this.BASE_URL}/employees`;
    private LOGIN = `${this.BASE_URL}/login`;

    constructor(private http: HttpClient) { }


    login(account: LoginRequest) {
        return this.http.post(this.LOGIN, account,{observe: 'response'});
    }

    getAllEmployees(): Observable<EmployeeResponse[]> {
        return this.http.get<EmployeeResponse[]>(this.EMPLOYEES);
    }

    deleteEmployee(employeeId: string) {
        return this.http.delete(`${this.EMPLOYEES}/${employeeId}`,{observe: 'response'});
    }
}
