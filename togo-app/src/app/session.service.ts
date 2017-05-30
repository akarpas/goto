import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Rx';
let jwtDecode = require('jwt-decode');

@Injectable()
export class SessionService implements CanActivate {
  public token: string;
  public isAuth: boolean;
  public user: string;

  constructor(
    private router: Router,
    private http: Http
  ) {
    this.token = localStorage.getItem('token');
    if (this.token != null) {
      this.isAuth = true;
    } else {
      this.isAuth = false;
    }
  }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.user = jwtDecode(this.token).user;
      this.isAuth = true;
      return true;
    }
    this.router.navigate(['/login']);
    this.isAuth = false;
    return false;
  }

  isAuthenticated() {
    return this.token != null ? true : false;
  }

  handleError(e) {
    return Observable.throw(e.json().message);
  }

  signup(user) {
    console.log("this is user: ",user)
    return this.http.post('http://localhost:3000/signup', user)
      .map((response) => response.json())
      .map((response) => {
        let token = response.token;
        const user = response.user;
        if (token) {
          this.token = token;
          this.user = jwtDecode(token).user;
          localStorage.setItem('token',token);
          this.isAuth = true;
        } else {
          return false;
        }
      })
      .catch((err) => Observable.throw(err));
  }

  login(user) {
    console.log("user from login: " + JSON.stringify(user));
    return this.http.post('http://localhost:3000/login', user)
      .map((response: Response) => {
        let token = response.json() && response.json().token;
        let user = response.json() && response.json().user;

        if (token) {
          this.token = token;
          this.user = jwtDecode(token).user;

          this.isAuth = true;

          localStorage.setItem('token',token);
          localStorage.setItem('user', JSON.stringify(user));
          return true;
        } else {
          return false;
        }
      });
  }

  logout() {
    this.token = null;
    this.user = null;
    this.isAuth = false;
    this.router.navigate(['']);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getUserIdFromLocal() {
    this.user = localStorage.getItem('user');
    var tmp = JSON.parse(this.user);
    console.log("this is tmp: "+tmp);
    return tmp._id;
  }

  getUserFromLocal() {
    this.user = localStorage.getItem('user');
    var tmp = JSON.parse(this.user);
    return tmp;
  }

  getUser(id) {
    return this.http.get(`http://localhost:3000/api/users/${id}`)
      .map(res => res.json())
  }

  edit(place, id) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.put(`http://localhost:3000/api/users/${id}`,place, options)
      .map((res) => res.json())
      .catch(this.handleError);
  }

  editWishlist(place, id) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.put(`http://localhost:3000/api/users/wishlist/${id}`,place, options)
      .map((res) => res.json())
      .catch(this.handleError);
  }

  remove(place, id) {
    return this.http.delete(`http://localhost:3000/api/users/wishlist/${id}`,place)
      .map((res) => res.json());
  }
}
