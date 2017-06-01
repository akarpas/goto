import { Component, OnInit } from '@angular/core';
import { SessionService } from "../session.service";

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css'],
  providers: [SessionService]
})
export class BrowseComponent implements OnInit {
  public destinations: any;
  userId: '';
  user: '';

  constructor(
    private session: SessionService
  ) { }

  ngOnInit() {
    this.session.getDestinations().subscribe((destinations)=>{
      this.destinations = destinations.sort(this.dynamicSort("city"));

    });
  }

  dynamicSort(property) {
      var sortOrder = 1;
      if(property[0] === "-") {
          sortOrder = -1;
          property = property.substr(1);
      }
      return function (a,b) {
          var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
          return result * sortOrder;
      }
  }

  getUserDetails(id) {
    this.userId = id;
    this.session.getUser(id)
      .subscribe((user)=>{
        this.user = user;
      });
  };

  addToWishlist(destination) {
    // console.log("this is the new place: " + this.newPlace);
    // console.log("this is the user ID: " + this.userId);
    this.userId = this.session.getUserIdFromLocal();
    var tempUser = this.getUserDetails(this.userId);
    console.log("city to add: " + JSON.stringify(destination))
    this.session.editWishlist(destination, this.userId)
      .subscribe((place)=>{
        this.getUserDetails(this.userId);
      });
  }
}
