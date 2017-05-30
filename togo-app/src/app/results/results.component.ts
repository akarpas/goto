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
    // const APIKEY = "KEY";
    // var url;
    // var photoReference;
    // var tmpResponse;
    // url = "http://maps.googleapis.com/maps/api/place/textsearch/json?query=" + result.city + "&key="+APIKEY;
    // tmpResponse = this.getPhotoReference(url).subscribe();
    // console.log(tmpResponse)
    // photoReference = tmpResponse.results[0].photos[0].photo_reference;
    // console.log(photoReference);

    this.detailsOn = true;
    this.showResult = result;
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
