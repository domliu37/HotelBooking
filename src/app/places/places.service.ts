import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { registerLocaleData } from '@angular/common';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);


  get places() {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) { }

  fetchPlaces() {
    return this.http
      .get<{ [key: string]: PlaceData }>('https://ionic-angular-fc429.firebaseio.com/offered-place.json')
      .pipe(map(resData => {
        const places = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            places.push(
              new Place(
                key,
                resData[key].title,
                resData[key].description,
                resData[key].imageUrl,
                resData[key].price,
                new Date(resData[key].availableFrom),
                new Date(resData[key].availableTo),
                resData[key].userId
              )
            );
          }
        }
        return places;
        //return [];
      }),
        tap(places => {
          this._places.next(places);
        })
      );
  }

  getPlace(id: string) {
    return this.http.get<PlaceData>(`https://ionic-angular-fc429.firebaseio.com/offered-place/${id}.json`).pipe(map(placeData => {
      return new Place(
        id,
        placeData.title,
        placeData.description,
        placeData.imageUrl,
        placeData.price,
        new Date(placeData.availableFrom),
        new Date(placeData.availableTo),
        placeData.userId
      );
    }));
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    let generatedId: string;
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'assets/Stamford.jpg',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );
    return this.http
      .post<{ name: string }>('https://ionic-angular-fc429.firebaseio.com/offered-place.json',
        { ...newPlace, id: null })
      .pipe(
        switchMap(resData => {
          generatedId = resData.name;
          return this.places;
        }),
        take(1),
        tap(places => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace));
        })
      );
    // return this.places.pipe(take(1), delay(1000), tap( places => {
    //   this._places.next(places.concat(newPlace));
    // } ))
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(take(1), switchMap(places => {
      if (!places || places.length <= 0) {
        return this.fetchPlaces();
      } else {
        return of(places);
      }
    }),
      switchMap(places => {
        const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
        );
        return this.http.put(
          `https://ionic-angular-fc429.firebaseio.com/offered-place/${placeId}.json`,
          { ...updatedPlaces[updatedPlaceIndex], id: null }
        );
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
    );
  }

}

// [new Place(
//   'p1',
//   'Stamford Plaza Auckland',
//   'High-end hotel with plush quarters, a fitness centre & an indoor pool, plus Thai & Japanese dining.',
//   'assets/Stamford.jpg',
//   258,
//   new Date('2015-01-05'),
//   new Date('2020-03-07'),
//   'a213'
// ),
// new Place(
//   'p2',
//   'Hilton Auckland',
//   'Contemporary waterfront hotel offering a seafood restaurant & an outdoor heated lap pool.',
//   'assets/Hilton.jpg',
//   428,
//   new Date('2015-01-05'),
//   new Date('2020-03-07'),
//   'a'
// ),
// new Place(
//   'p3',
//   'A Heritage Auckland',
//   'Refined hotel with a restaurant & a chic bar, as well as a rooftop pool & a tennis court.',
//   'assets/Heritage.jpg',
//   223,
//   new Date('2015-01-05'),
//   new Date('2020-03-07'),
//   'a'
// )]