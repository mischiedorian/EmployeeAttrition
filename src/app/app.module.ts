import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {RouterModule, Routes} from '@angular/router';
import {NavigationComponent} from './navigation/navigation.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {NgHttpLoaderModule} from 'ng-http-loader';
import {ManagementEmployeesComponent} from './management-employees/management-employees.component';
import {ModalResponseComponent} from './modal-response/modal-response.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ToastrModule} from 'ngx-toastr';
import {ConfirmationDialogComponent} from './confirmation-dialog/confirmation-dialog.component';

const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'admin/management',
    component: ManagementEmployeesComponent
  },
  {
    path: 'admin/login',
    component: LoginComponent
  },
  {
    path: '**',
    component: HomeComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    LoginComponent,
    HomeComponent,
    ManagementEmployeesComponent,
    ModalResponseComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    NgHttpLoaderModule.forRoot(),
    NgbModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ModalResponseComponent, ConfirmationDialogComponent]
})
export class AppModule {
}
