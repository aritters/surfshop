import { Component } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { of, Observable } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

import { Product } from './../../interfaces/product';
import { AuthService } from './../../services/auth.service';
import { ProductService } from './../../services/product.service';
import { BasePage } from './../base-page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage extends BasePage {

  products$: Observable<Product[]>;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    toastCtrl: ToastController,
    loadingCtrl: LoadingController) {
    super(loadingCtrl, toastCtrl);
  }

  ionViewWillEnter() {
    this.products$ = this.productService.getProducts()
      .pipe(
        takeUntil(this.unsub$),
        catchError(error => {
          console.error('erro => ', error);
          return of(new Array<Product>());
        })
      );
  }

  canDeleteProduct(product: Product) {
    const { uid } = this.authService.getAuth().currentUser || { uid: '' };
    return product.userId === uid;
  }

  async deleteProduct(id: string) {
    await this.presentLoading();

    try {
      await this.productService.deleteProduct(id);
    }
    catch (error) {
      console.error(error);
      this.presentToast('Erro ao excluir produto');
    }
    finally {
      this.loading.dismiss();
    }
  }

  async logout() {
    try {
      this.tryCompleteUnsubscriber();

      await this.authService.logout();
    }
    catch (error) {
      console.error(error);
      this.presentToast('Erro ao sair da conta');
    }
  }

}
