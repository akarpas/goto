import { Component, OnInit } from '@angular/core';
import { SessionService } from "../session.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  user: any;
  error: string;

  constructor(
    private session: SessionService,
    private router: Router
  ) { }

  ngOnInit() {

  }

  logout() {
    this.session.logout()
  }

  errorCb(err) {
    this.error = err;
    this.user = null;
  }

  successCb(user) {
    this.user = user;
    this.error = null;
  }

  gotoDashboard() {
    var id = this.session.getUserIdFromLocal();
    this.router.navigate(['/dashboard/',id]);
  }

  gotoRegister() {
    this.router.navigate(['/signup']);
  }

  gotoLogin() {
    this.router.navigate(['/login']);
  }

}
