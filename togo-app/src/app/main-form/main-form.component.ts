import { Component, OnInit } from '@angular/core';
import { SessionService } from "../session.service";

@Component({
  selector: 'app-main-form',
  templateUrl: './main-form.component.html',
  styleUrls: ['./main-form.component.css'],
  inputs: ['value']
})

export class MainFormComponent implements OnInit {
  newSearch: any = {
    name: '',
    country: '',
    city: '',
    people: 0,
    budget: 0,
    duration: 0,
    startDate: new Date,
    endDate: new Date,
    type: ''
  };
  userName: string;
  userCity: string;
  userCountry: string;


  constructor(private session: SessionService) { }

  ngOnInit() {
    if (this.session.isAuth) {
      var currentUser = this.session.getUserFromLocal();
      this.newSearch.name = currentUser.name;
      this.newSearch.city = currentUser.city;
      this.newSearch.country = currentUser.country;
      console.log(this.userName)
    }
  }

  onSelectionChange(entry) {
    this.newSearch.type = entry;
    console.log(this.newSearch.type);
  }

  submitForm() {
    console.log(this.newSearch);
  }

  doSearch() {

  }

}
