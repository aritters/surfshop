import { AuthService } from './../../services/auth.service';
import { User } from './../../interfaces/user';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, LoadingController, ToastController } from '@ionic/angular';

import { Keyboard } from '@ionic-native/keyboard/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild(IonSlides, { static: true }) slides: IonSlides;

  wavesPosition: number = 0;
  wavesDifferece: number = 80;

  userLogin: User = {};
  userRegister: User = {};
  private loading: any;

  constructor(
    public keyboard: Keyboard,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController) { }

  ngOnInit() {
  }

  async login() {
    await this.presentLoading();

    try {
      await this.authService.login(this.userLogin);
    }
    catch (err) {
      console.error(err);
      this.presentToast(err.message);
    }
    finally {
      this.loading.dismiss();
    }
  }

  async register() {
    await this.presentLoading();

    try {
      await this.authService.register(this.userRegister);
    }
    catch (err) {
      console.error(err);
      this.presentToast(err.message);
    }
    finally {
      this.loading.dismiss();
    }
  }

  segmentChanged(event: any) {

    const { value } = event.detail;

    if (value === 'login') {
      this.slides.slidePrev();
      this.wavesPosition += this.wavesDifferece;
    } else {
      this.slides.slideNext();
      this.wavesPosition -= this.wavesDifferece;
    }

    console.log(event);
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Por favor, aguarde...' });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000
    });

    return toast.present();
  }

}
