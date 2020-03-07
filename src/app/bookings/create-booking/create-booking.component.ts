import { Component, OnInit, Input } from '@angular/core';
import { Place } from '../../places/place.model';
import { ModalController } from '@ionic/angular';
import { runInThisContext } from 'vm';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;

  constructor(private modatCtrl: ModalController) { }

  ngOnInit() {}

  onCancel() {
    this.modatCtrl.dismiss(null, 'cancel');

  }

  onBookPlace() {
    this.modatCtrl.dismiss({message: 'This is a message'});
  }

}
