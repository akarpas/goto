import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.css']
})
export class SignupFormComponent implements OnInit {
  signup: any = {
    name: '',
    surname: '',
    email: '',
    address: '',
    street: '',
    postCode: '',
    city: '',
    country: '',
    lat: '',
    lng: '',
    password: '',
    passwordConfirm: ''
  };

  constructor() { }

  ngOnInit() {

  }

  updateFields() {
    console.log("here!");
  }

  submitForm() {
    console.log(this.signup);
  }

}
