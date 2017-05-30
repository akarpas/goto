import { Injectable, EventEmitter } from '@angular/core'
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ExternalApisService {
  public query: any;
  public results: any;

  constructor(
    private router: Router,
    private http: Http
  ) {}


  handleQuery(query) {
    console.log("this is the query: " + JSON.stringify(query));
    return this.http.post('http://localhost:3000/query/search',query)
        .map((response) => response.json())
        .map((response) => {
          console.log("this is the response " + response);
          const results = response;
          localStorage.setItem('results',response);
    })
    .catch((err) => Observable.throw(err));
      // .map((res: Response) => console.log( JSON.stringify( res.json() ) )

  }

  getResultsFromLocalStorage() {
    this.results = localStorage.getItem('results');
    return this.results;
  }

}
