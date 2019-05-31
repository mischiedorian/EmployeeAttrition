import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {Router, RouterModule, Routes} from '@angular/router';
import {NavigationComponent} from './navigation/navigation.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {NgHttpLoaderModule} from 'ng-http-loader';
import {ManagementEmployeesComponent} from './management-employees/management-employees.component';

const appRoutes: Routes = [
  {
    path:'',
    component: HomeComponent
  },
  {
    path: 'admin/management',
    component: ManagementEmployeesComponent
  },
  {
    path: 'admin/login',
    component: LoginComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    LoginComponent,
    HomeComponent,
    ManagementEmployeesComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    NgHttpLoaderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
