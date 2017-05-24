import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { MainFormComponent } from './main-form/main-form.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { SignupFormComponent } from './signup-form/signup-form.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: MainFormComponent},
  {path: 'signup', component: SignupFormComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    MainFormComponent,
    NavBarComponent,
    SignupFormComponent
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
