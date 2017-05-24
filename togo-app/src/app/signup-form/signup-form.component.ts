import { NgZone, ElementRef, Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MapsAPILoader } from 'angular2-google-maps/core';

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
    street: '',
    streetN: '',
    postCode: '',
    city: '',
    country: '',
    lat: '',
    lng: '',
    password: '',
    passwordConfirm: ''
  };
  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;

  @ViewChild("search")
  public searchElementRef: ElementRef;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.searchControl = new FormControl();

    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          // Location details
          for (let i = 0; i < place.address_components.length; i++) {
            if (place.address_components[i].types[0] === 'postal_code') {
            this.signup.postCode = place.address_components[i].long_name;
            }
            if (place.address_components[i].types[0] === 'country') {
            this.signup.country = place.address_components[i].long_name;
            }
            if (place.address_components[i].types[0] === 'route') {
            this.signup.street = place.address_components[i].long_name;
            }
            if (place.address_components[i].types[0] === 'street_number') {
            this.signup.streetN = place.address_components[i].long_name;
            }
            if (place.address_components[i].types[0] === 'locality') {
            this.signup.city = place.address_components[i].long_name;
            }
          }

          //set latitude, longitude
          this.signup.lat = place.geometry.location.lat();
          this.signup.lng = place.geometry.location.lng();
          console.log(place);
        });
      });
    });
  }

  updateFields() {
    console.log("here!");
  }

  submitForm() {
    console.log(this.signup);
  }

}
