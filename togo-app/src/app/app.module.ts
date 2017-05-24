import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { MainFormComponent } from './main-form/main-form.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { SignupFormComponent } from './signup-form/signup-form.component';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ResultsComponent } from './results/results.component';
import { FooterComponent } from './footer/footer.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: MainFormComponent},
  {path: 'signup', component: SignupFormComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'results', component: ResultsComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    MainFormComponent,
    NavBarComponent,
    SignupFormComponent,
    DashboardComponent,
    ResultsComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
