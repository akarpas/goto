import { ElementRef, NgZone, ViewChild, Component, OnInit } from '@angular/core';
import { SessionService } from "../session.service";
import { ExternalApisService } from "../external-apis.service";
import { MapsAPILoader } from "angular2-google-maps/core";
import { ActivatedRoute } from '@angular/router';
import { FormControl } from "@angular/forms";
import { HttpModule } from '@angular/http';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Router } from "@angular/router";

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
    country_loc: '',
    city: '',
    location: '',
    origin_lat: '',
    origin_lng: '',
    origin_airport: '',
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
  error: string;
  loading: boolean = false;
  formComplete: boolean = false;
  today = new Date();
  afterStartDate: boolean = false;
  beforeToday: boolean = false;


  public searchControl: FormControl;

  @ViewChild("search")
  public searchElementRef1: ElementRef;

  constructor(
    private session: SessionService,
    private apiSession: ExternalApisService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private route: ActivatedRoute,
    private http: Http,
    private router: Router
  ) { }

  ngOnInit() {

    this.today = this.newSearch.startDate;
    console.log("dates " + this.newSearch.startDate + " " + this.newSearch.endDate)
    if (this.session.isAuth) {
      var currentUser = this.session.getUserFromLocal();
      this.newSearch.name = currentUser.name;
    }

    this.searchControl = new FormControl();

    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef1.nativeElement, {
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
          for (let i = 0; i < place.address_components.length; i++) {
            console.log("GOOGLE COMPONENT: ", place.address_components);
            if (place.address_components[i].types[0] === 'country') {
              this.newSearch.country = place.address_components[i].long_name;
              this.newSearch.country_loc = place.address_components[i].short_name;
            }
            if (place.address_components[i].types[0] === 'locality') {
              this.newSearch.city = place.address_components[i].long_name;
            }
          }

          this.newSearch.origin_lat = Number(place.geometry.location.lat());
          this.newSearch.origin_lng = Number(place.geometry.location.lng());

          //set latitude, longitude
          console.log(this.newSearch);
          this.getAirport().subscribe((info) => (this.newSearch.origin_airport = info[0].airport))
          // console.log("tmpAirportInfo: "+ JSON.stringify(tmpAirportInfo));
        });
      });
    });


  }

  onSelectionChange(entry) {
    this.newSearch.type = entry;
    console.log(this.newSearch.type);
  }

  submitForm() {
    //check that all fields are completed
    if (this.newSearch.country === '' || this.newSearch.city === '' || this.newSearch.location === '' || this.newSearch.people === 0 || this.newSearch.budget === 0 || this.newSearch.duration === 0
      || this.newSearch.startDate === this.today || this.newSearch.endDate === this.today || this.newSearch.type === '') {
      this.formComplete = false;
    } else if (this.newSearch.startDate > this.newSearch.endDate) {
      this.afterStartDate = true;
    } else if (this.newSearch.startDate < this.today) {
      this.beforeToday = true;
    } else {
      this.loading = true;
      // console.log(this.newSearch);
      console.log("ORIGIN AIRPORT: " + this.newSearch.origin_airport);
      this.apiSession.handleQuery(this.newSearch).subscribe(result=>{
        this.router.navigate(['/results']);
      });
    }
  }

  getAirport() {
    const API_AMADEUS = "amadeus"; // *APIKEY*
    let airport;
    const url = "https://api.sandbox.amadeus.com/v1.2/airports/nearest-relevant?apikey="+API_AMADEUS+"&latitude&latitude=" + Number(this.newSearch.origin_lat) + "&longitude=" + Number(this.newSearch.origin_lng);
    console.log(url);
    return this.http.get(url)
      .map((response) => response.json())
  }


}
