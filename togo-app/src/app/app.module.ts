import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { MainFormComponent } from './main-form/main-form.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { SignupFormComponent } from './signup-form/signup-form.component';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ResultsComponent } from './results/results.component';
import { FooterComponent } from './footer/footer.component';
import { AgmCoreModule } from "angular2-google-maps/core";
import { SessionService } from "./session.service";
import { LoginFormComponent } from './login-form/login-form.component';


const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: MainFormComponent},
  {path: 'signup', component: SignupFormComponent},
  {path: 'dashboard/:id', component: DashboardComponent, canActivate: [SessionService]},
  {path: 'results', component: ResultsComponent},
  {path: 'login', component: LoginFormComponent}

];

@NgModule({
  declarations: [
    AppComponent,
    MainFormComponent,
    NavBarComponent,
    SignupFormComponent,
    DashboardComponent,
    ResultsComponent,
    FooterComponent,
    LoginFormComponent
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyCO9v0TJohXqLEVOQ7DQ_L5yXOAUzhtRiw",
      libraries: ["places"]
    }),
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule
  ],
  providers: [SessionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
