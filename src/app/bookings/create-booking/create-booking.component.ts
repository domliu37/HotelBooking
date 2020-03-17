import { Component, OnInit, Input } from '@angular/core';
import { Place } from '../../places/place.model';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;
  @Input() selectMode: 'select' | 'random';
  startDate: string;
  endDate: string;

  constructor(private modatCtrl: ModalController) { }

  ngOnInit() {
    const availableFrom = new Date(this.selectedPlace.availableFrom);
    const availableTo = new Date(this.selectedPlace.availableTo);
    if (this.selectMode === 'random') {
      // calculate random date method, a week before the max date
      this.startDate =
      new Date(availableFrom.getTime() +
      Math.random() *
        (availableTo.getTime() -
          7 * 24 * 60 * 60 * 1000 -
          availableFrom.getTime())
          ).toISOString();

      this.endDate =
      new Date(new Date(this.startDate).getTime() +
      Math.random() *
      (new Date(this.startDate).getTime() +
      6 * 24 * 60 * 60 * 1000 -
      new Date(this.startDate).getTime())).toISOString();
    }

  }

  onCancel() {
    this.modatCtrl.dismiss(null, 'cancel');

  }

  onBookPlace() {
    this.modatCtrl.dismiss({message: 'This is a message'}, 'comfirm');
  }

}
