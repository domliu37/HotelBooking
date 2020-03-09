import { Injectable } from '@angular/core';
import { Booking } from './booking.model';
@Injectable({
    providedIn: 'root'
  })

export class BookingService {
    private _bookings: Booking[] = [
        {
            id: 'LDM',
            placeId: 'p1',
            userId: 'dom',
            guestNumber: 37,
            placeTitle: 'Auckland'
        }
    ];

    get bookings() {
        return [...this._bookings];
      }


    constructor() { }
}