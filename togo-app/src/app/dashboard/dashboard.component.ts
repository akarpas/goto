import { ElementRef, NgZone, ViewChild, Component, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MapsAPILoader } from "angular2-google-maps/core";
import { Router } from "@angular/router";
import { SessionService} from "../session.service";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [SessionService]
})
export class DashboardComponent implements OnInit {
  newPlace: any = {
    city: '',
    country: '',
    lat: 0,
    lng: 0
  }
  userId: ''

  public latitude: number;
  public longitude: number;
  public zoom: number;
  public searchControl: FormControl;

  user: any = {};
  place: any = {};
  error: string;

  @ViewChild("search")
  public searchElementRef: ElementRef;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private session: SessionService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.searchControl = new FormControl();

    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ['(cities)']
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
          var area1;
          var area2;
          var area3;
          var colluquial;
          for (let i = 0; i < place.address_components.length; i++) {
            console.log("GOOGLE COMPONENT: ", place.address_components);
            if (place.address_components[i].types[0] === 'country') {
              this.newPlace.country = place.address_components[i].long_name;
            }
            if (place.address_components[i].types[0] === 'locality' || place.address_components[i].types[0] === 'colloquial_area') {
              this.newPlace.city = place.address_components[i].long_name;
            }
            if (place.address_components[i].types[0] === 'administrative_area_level_1') {
              area1 = place.address_components[i].long_name;
            }
            if (place.address_components[i].types[0] === 'administrative_area_level_2') {
              area2 = place.address_components[i].long_name;
            }
            if (place.address_components[i].types[0] === 'administrative_area_level_3') {
              area3 = place.address_components[i].long_name;
            }
          }

          if (this.newPlace.city === '') {
            this.newPlace.city = area1;
          }
          if (this.newPlace.city === '') {
            this.newPlace.city = area2;
          }
          if (this.newPlace.city === '') {
            this.newPlace.city = area3;
          }

          //set latitude, longitude
          this.newPlace.lat = Number(place.geometry.location.lat());
          this.newPlace.lng = Number(place.geometry.location.lng());
          console.log(this.newPlace);
        });
      });
    });

    this.route.params.subscribe(params => {
      this.getUserDetails(params['id']);
    });
    this.zoom = 2;


  }

  getUserDetails(id) {
    this.userId = id;
    this.session.getUser(id)
      .subscribe((user)=>{
        this.user = user;
        console.log("this: ", user);
        console.log(this.user);
      });
  };

  addPlace() {
    console.log("this is the new place: " + this.newPlace);
    console.log("this is the user ID: " + this.userId);
    this.session.edit(this.newPlace, this.userId)
      .subscribe((place)=>{
        this.newPlace.city = "";
        this.newPlace.country = "";
        this.getUserDetails(this.userId);
      });
  };
}
