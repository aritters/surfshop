import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { takeUntil } from 'rxjs/operators';

import { BasePage } from '../base-page';
import { Product } from './../../interfaces/product';
import { AuthService } from './../../services/auth.service';
import { ProductService } from './../../services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage extends BasePage {

  product: Product = {};
  productId: string = null;

  get canUpdateProduct() {
    return !this.productId || this.product.userId === this.authService.getAuth().currentUser.uid;
  }

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    loadingCtrl: LoadingController,
    toastCtrl: ToastController) {
    super(loadingCtrl, toastCtrl);
  }

  ionViewWillEnter() {
    this.productId = this.activatedRoute.snapshot.params['id'];

    if (!!this.productId) {
      this.loadProduct();
    }
  }

  loadProduct() {
    this.productService.getProduct(this.productId)
      .pipe(
        takeUntil(this.unsub$)
      )
      .subscribe(data => {
        this.product = data;
      })
  }

  async saveProduct() {
    await this.presentLoading();

    this.product.userId = this.authService.getAuth().currentUser.uid;

    if (!!this.productId) {
      try {
        await this.productService.updateProduct(this.productId, this.product);
        await this.loading.dismiss();

        this.navCtrl.navigateBack('/home');
      }
      catch (error) {
        console.error(error);
        this.presentToast('Erro ao salvar o produto');
        this.loading.dismiss();
      }

    } else {
      this.product.createdAt = new Date().getTime();

      try {
        await this.productService.addProduct(this.product);
        await this.loading.dismiss();

        this.navCtrl.navigateBack('/home');
      }
      catch (error) {
        console.error(error);
        this.presentToast('Erro ao salvar o produto');
        this.loading.dismiss();
      }
    }
  }
}
