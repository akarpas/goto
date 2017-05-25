import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class SessionService {

  constructor(private http: Http) { }

  handleError(e) {
    return Observable.throw(e.json().message);
  }

  signup(user) {
    console.log("this is user: ",user)
    return this.http.post('http://localhost:3000/signup', user)
      .map(res => res.json())
      .catch(this.handleError);
  }

  login(user) {
    console.log("user from login: " + JSON.stringify(user));
    return this.http.post('http://localhost:3000/login', user)
      .map(res => res.json())
      .catch(this.handleError);
  }

  logout() {
    return this.http.post(`http://localhost:3000/logout`, {})
      .map(res => res.json())
      .catch(this.handleError);
  }

  isLoggedIn() {
    return this.http.get(`http://localhost:3000/loggedin`)
      .map(res => res.json())
      .catch(this.handleError);
  }

  getPrivateData() {
    return this.http.get(`http://localhost:3000/private`)
      .map(res => res.json())
      .catch(this.handleError);
  }

  getUser(id) {
    return this.http.get(`http://localhost:3000/api/users/${id}`)
      .map(res => res.json())
  }
}
