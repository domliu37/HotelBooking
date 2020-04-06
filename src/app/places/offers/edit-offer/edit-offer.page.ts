import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  place: Place;
  placeId: string;
  form: FormGroup;
  isLoading = false;
  private placesSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private placeService: PlacesService,
    private router: Router,
    private LoadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.placeId = paramMap.get('placeId');
      this.isLoading = true;
      this.placesSub = this.placeService.getPlace(paramMap.get('placeId')).subscribe(places => {
        this.place = places;
        this.form = new FormGroup({
          title: new FormControl(this.place.title, {
            updateOn: 'blur',
            validators: [Validators.required],
          }),
          description: new FormControl(this.place.description, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.maxLength(180)],
          })
        });
        this.isLoading = false;

      }, error => {
        this.alertCtrl.create({header: 'An error occurred!', message: 'Invalid Place', buttons: [{text: 'Okay', handler: () => {
          this.router.navigate(['/places/tabs/offers']);
        } }]}).then(alertEl => {
          alertEl.present();
        });
      });
    });
  }


  onUpdateOffer() {
    if (!this.form.valid) {
      return;
    }
    this.LoadingCtrl.create({
      message: 'Updating Place...'
    }).then(loadingEl => {
      loadingEl.present();
      this.placeService.updatePlace(
        this.place.id,
        this.form.value.title,
        this.form.value.description
      ).subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['/places/tabs/offers']);
      });
    });

  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

}
