import {Injectable} from "@angular/core";
import {LoginRequest} from "../login/login.component";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {Employee} from "../management-employees/management-employees.component";
import {AttritionResponse, EmployeeModel} from "../home/home.component";

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

    getAllEmployees(): Observable<Employee[]> {
        return this.http.get<Employee[]>(this.EMPLOYEES);
    }

    deleteEmployee(employeeId: string) {
        return this.http.delete(`${this.EMPLOYEES}/${employeeId}`,{observe: 'response'});
    }

    getAttrition(employee: EmployeeModel): Observable<HttpResponse<AttritionResponse>> {
        return this.http.post<AttritionResponse>(this.ATTRITION, employee, {observe: 'response'});
    }
}
