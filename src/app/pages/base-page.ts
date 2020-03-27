import { LoadingController, ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';

export class BasePage {

  protected loading: any;
  protected unsub$ = new Subject();

  constructor(
    protected loadingCtrl: LoadingController,
    protected toastCtrl: ToastController
  ) { }

  ionViewWillLeave() {
    this.tryCompleteUnsubscriber();
  }

  protected tryCompleteUnsubscriber() {
    try {
      this.unsub$.next();
      this.unsub$.complete();
    } catch { }
  }

  protected async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Por favor, aguarde...' });
    return this.loading.present();
  }

  protected async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000
    });

    return toast.present();
  }
}
