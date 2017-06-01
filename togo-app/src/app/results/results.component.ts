import { ElementRef, NgZone, ViewChild, Component, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MapsAPILoader } from "angular2-google-maps/core";
import { Router } from "@angular/router";
import { ExternalApisService } from "../external-apis.service";
import { SessionService} from "../session.service";
import { ActivatedRoute } from "@angular/router";
import { HttpModule } from '@angular/http';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
  providers: [ExternalApisService, SessionService]
})
export class ResultsComponent implements OnInit {
  public searchControl: FormControl;
  public latitude: number;
  public longitude: number;
  public zoom: number;
  results: any = {};
  showResult: any = {};
  detailsOn: boolean = false;
  userId: '';
  user: any = {};
  place: any = {};
  beenHere: boolean = false;


  @ViewChild("search")
  public searchElementRef: ElementRef;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private apiSession: ExternalApisService,
    private route: ActivatedRoute,
    private session: SessionService,
    private http: Http
  ) { }

  ngOnInit() {
    var id = this.session.getUserIdFromLocal();
    this.user = this.getUserDetails(id);

    this.results = JSON.parse(this.apiSession.getResultsFromLocalStorage());

    console.log(("converted results: " + this.results[0]));

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


        });
      });
    });

    this.latitude=30;
    this.longitude=45;
    this.zoom = 1;
  }

  showDetails(result) {
    this.detailsOn = true;
    this.showResult = result;


    var temp = [];
    this.user.places.forEach(function(place){
      temp.push(place.city);
    });
    console.log("this is temp " + temp)
    if (this.showResult.city === this.user.city || temp.indexOf(this.showResult.city) !== -1) {
      this.beenHere = true;
    } else {
      this.beenHere = false;
    }
    console.log(this.showResult);
    console.log("clicked");
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

  addToWishlist() {
    // console.log("this is the new place: " + this.newPlace);
    // console.log("this is the user ID: " + this.userId);
    this.userId = this.session.getUserIdFromLocal();
    var tempUser = this.getUserDetails(this.userId);
    console.log("city to add: " + JSON.stringify(this.showResult))
    this.session.editWishlist(this.showResult, this.userId)
      .subscribe((place)=>{
        this.getUserDetails(this.userId);
      });
  }

  // getPhotoReference(url) {
  //   let headers = new Headers({ 'Content-Type': 'application/json' });
  //   let options = new RequestOptions({ headers: headers });
  //   return this.http.get(url,options)
  //     .map((response) => response.json())
  // }
}
