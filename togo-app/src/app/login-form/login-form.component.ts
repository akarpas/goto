import { Component, OnInit } from '@angular/core';
import { SessionService } from "../session.service";
import { Router } from "@angular/router";


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  formInfo = {
    email: '',
    password: ''
  };

  user: any;
  error: string;

  constructor(
    private session: SessionService,
    private router: Router
  ) { }

  ngOnInit() {
    this.session.isLoggedIn()
      .subscribe(
        (user) => this.successCb(user)
      );
  }

  login() {
    console.log(this.formInfo);
    this.session.login(this.formInfo)
      .subscribe(
    (user) => {
      this.user = user
      console.log("HERE: "+ user._id);
      this.router.navigate(['/dashboard/',user._id]);
    },
      (err) => this.error = err
    );
  }

  errorCb(err) {
    this.error = err;
    this.user = null;
  }

  successCb(user) {
    this.user = user;
    this.error = null;
  }
}
