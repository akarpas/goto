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
  }



  login() {
    console.log(this.formInfo);
    this.session.login(this.formInfo)
    .subscribe(result => {
	    if (result === true) {
			     // login successful
           var id = this.session.getUserIdFromLocal();
			     this.router.navigate(['/dashboard/',id]);
				} else {
			     // login failed
			     this.error = 'Username or password is incorrect';
		   }
	  });
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
