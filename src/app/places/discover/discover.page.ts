import { Component, OnInit, OnDestroy } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/core';

import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {

  loadedPlaces: Place[];
  relevantPlaces: Place[];
  isLoading = false;
  private placesSub: Subscription;
  //listedLoadedPlaces: Place[];

  constructor(private PlaceServices: PlacesService, private authServices: AuthService) { }

  ngOnInit() {
    this.placesSub = this.PlaceServices.places.subscribe(places => {
      this.loadedPlaces = places;
      this.relevantPlaces = this.loadedPlaces;
    });
    //this.listedLoadedPlaces = this.loadedPlaces.slice(1);
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.PlaceServices.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    if (event.detail.value === 'all') {
      this.relevantPlaces = this.loadedPlaces;
    } else {
      this.relevantPlaces = this.loadedPlaces.filter(place =>  place.userId !== this.authServices.userId);
    }
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

}
