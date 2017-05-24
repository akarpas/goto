import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-form',
  templateUrl: './main-form.component.html',
  styleUrls: ['./main-form.component.css']
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


  constructor() {
   }

  ngOnInit() {
  }

  onSelectionChange(entry) {
    this.newSearch.type = entry;
    console.log(this.newSearch.type);
  }

  submitForm() {
    console.log(this.newSearch);
  }


}
