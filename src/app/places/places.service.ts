import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places: Place[] = [
    new Place(
      'p1',
      'Stamford Plaza Auckland',
      'High-end hotel with plush quarters, a fitness centre & an indoor pool, plus Thai & Japanese dining.',
      'assets/Stamford.jpg',
      258
    ),
    new Place(
      'p2',
      'Hilton Auckland',
      'Contemporary waterfront hotel offering a seafood restaurant & an outdoor heated lap pool.',
      'assets/Hilton.jpg',
      428
    ),
    new Place(
      'p3',
      'A Heritage Auckland',
      'Refined hotel with a restaurant & a chic bar, as well as a rooftop pool & a tennis court.',
      'assets/Heritage.jpg',
      223
    )
  ];

  get places() {
    return [...this._places];
  }

  constructor() { }

  getPlace(id: string) {
    return {...this._places.find(p => p.id === id)};
  }
}
