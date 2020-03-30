import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([new Place(
    'p1',
    'Stamford Plaza Auckland',
    'High-end hotel with plush quarters, a fitness centre & an indoor pool, plus Thai & Japanese dining.',
    'assets/Stamford.jpg',
    258,
    new Date('2015-01-05'),
    new Date('2020-03-07'),
    'a213'
  ),
  new Place(
    'p2',
    'Hilton Auckland',
    'Contemporary waterfront hotel offering a seafood restaurant & an outdoor heated lap pool.',
    'assets/Hilton.jpg',
    428,
    new Date('2015-01-05'),
    new Date('2020-03-07'),
    'a'
  ),
  new Place(
    'p3',
    'A Heritage Auckland',
    'Refined hotel with a restaurant & a chic bar, as well as a rooftop pool & a tennis court.',
    'assets/Heritage.jpg',
    223,
    new Date('2015-01-05'),
    new Date('2020-03-07'),
    'a'
  )]);


  get places() {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService) { }

  getPlace(id: string) {
    return this.places.pipe(take(1), map(places => {
      return {...places.find(p => p.id === id)};
    }));
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
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

    return this.places.pipe(take(1), delay(1000), tap( places => {
      this._places.next(places.concat(newPlace));
    } ));
  }

  updatePlace(placeId: string, title: string, description: string) {
    return this.places.pipe(take(1), delay(1000), tap(places => {
      const updatedPlaceIndex = places.findIndex( pl => pl.id === placeId);
      const updatedPlaces = [...places];
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
      this._places.next(updatedPlaces);
    }));
  }

}