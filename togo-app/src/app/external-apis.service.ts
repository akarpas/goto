import { Injectable, EventEmitter } from '@angular/core'
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ExternalApisService {
  public query: any;

  constructor(
    private router: Router,
    private http: Http
  ) {}


  handleQuery(query) {
    console.log("this is the query: " + JSON.stringify(query));
    return this.http.post('http://localhost:3000/query/search',query)
      .map((res: Response) => res.json())
  }

}
