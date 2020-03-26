import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { IonSlides, LoadingController, ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { User } from '../../interfaces/user';
import { AuthService } from './../../services/auth.service';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {

  private loading: any;
  private unsub$ = new Subject();

  @ViewChild(IonSlides, { static: true }) slides: IonSlides;

  wavesPosition: number = 0;
  wavesDifferece: number = 80;

  userLogin: User = {};
  userRegister: User = {};

  constructor(
    public keyboard: Keyboard,
    private authService: AuthService,
    private userService: UserService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.unsub$.next();
    this.unsub$.complete();
  }

  async login() {
    await this.presentLoading();

    try {
      await this.authService.login(this.userLogin);

      this.userService.getUser(this.authService.getAuth().currentUser.uid)
        .pipe(
          takeUntil(this.unsub$)
        )
        .subscribe(user => {
          this.presentToast(`Seja bem-vindo, ${user.name}`);
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
