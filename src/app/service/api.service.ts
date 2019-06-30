import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {LoginRequest} from "../models/request/login-request";
import {ResponseList} from "../models/response/response-list";
import {EmployeeModel} from "../models/employee-model";
import {AttritionResponse} from "../models/response/attrition-response";
import {PerformanceResponse} from "../models/response/performance-response";
import {FeatureImportance} from "../models/response/feature-importance";

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private BASE_URL = 'http://localhost:5000';
    private ATTRITION = `${this.BASE_URL}/attrition`;
    private PERFORMANCE = `${this.BASE_URL}/performance`;
    private REBALANCE = `${this.BASE_URL}/rebalance`;
    private IMPORTANCE = `${this.BASE_URL}/feature-importance`;
    private EMPLOYEES = `${this.BASE_URL}/employees`;
    private LOGIN = `${this.BASE_URL}/login`;

    constructor(private http: HttpClient) { }


    login(account: LoginRequest) {
        return this.http.post(this.LOGIN, account,{observe: 'response'});
    }

    getAllEmployees(pageNr: number, totalPerPage: number): Observable<ResponseList> {
        return this.http.get<ResponseList>(`${this.EMPLOYEES}/page/${pageNr}/number/${totalPerPage}`);
    }

    deleteEmployee(employeeId: string) {
        return this.http.delete(`${this.EMPLOYEES}/${employeeId}`,{observe: 'response'});
    }

    getAttrition(employee: EmployeeModel): Observable<HttpResponse<AttritionResponse>> {
        return this.http.post<AttritionResponse>(this.ATTRITION, employee, {observe: 'response'});
    }

    getPerformance() {
        return this.http.get<PerformanceResponse>(this.PERFORMANCE);
    }

    reBalance() {
        return this.http.get<PerformanceResponse>(this.REBALANCE);
    }

    getFeatureImportance() {
        return this.http.get<FeatureImportance>(this.IMPORTANCE);
    }
}
