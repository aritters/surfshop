import { Component, ViewChild } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { IonSlides, LoadingController, ToastController } from '@ionic/angular';
import { take } from 'rxjs/operators';

import { User } from '../../interfaces/user';
import { BasePage } from '../base-page';
import { AuthService } from './../../services/auth.service';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage extends BasePage {

  @ViewChild(IonSlides, { static: true }) slides: IonSlides;

  wavesPosition: number = 0;
  wavesDifferece: number = 80;

  userLogin: User = {};
  userRegister: User = {};

  constructor(
    public keyboard: Keyboard,
    private authService: AuthService,
    private userService: UserService,
    loadingCtrl: LoadingController,
    toastCtrl: ToastController) {
    super(loadingCtrl, toastCtrl);
  }

  async login() {
    await this.presentLoading();

    try {
      await this.authService.login(this.userLogin);

      this.userService.getUser(this.authService.getAuth().currentUser.uid)
        .pipe(
          take(1)
        )
        .subscribe(user => {
          this.presentToast(`Bem-vindo, ${user.name}`);
        });
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
      const newUser = await this.authService.register(this.userRegister);
      await this.userService.addUser(newUser.user.uid, this.userRegister);
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
  }

}
