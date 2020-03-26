import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Product } from './../../interfaces/product';
import { AuthService } from './../../services/auth.service';
import { ProductService } from './../../services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  private loading: any;
  private unsub$ = new Subject();

  products: Product[] = [];

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private productService: ProductService,
    private authService: AuthService
  ) {
    this.productService.getProducts()
      .pipe(
        takeUntil(this.unsub$)
      )
      .subscribe(data => {
        this.products = data;
      });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsub$.next();
    this.unsub$.complete();
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
      await this.authService.logout();
    }
    catch (error) {
      console.error(error);
      this.presentToast('Erro ao sair da conta');
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
